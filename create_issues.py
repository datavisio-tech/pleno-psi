#!/usr/bin/env python3
"""
Script para criar todas as issues do PlenoPsi MVP no GitHub.

Este script lê a estrutura de issues do arquivo issues-structure.yaml
e cria todas as issues programaticamente usando a GitHub API.

Uso:
    export GITHUB_TOKEN="seu_token_aqui"
    python create_issues.py

Ou:
    python create_issues.py --token seu_token_aqui --repo datavisio-tech/pleno-psi
"""

import os
import sys
import argparse
import yaml
from typing import Dict, List, Optional
import requests
from time import sleep


class GitHubIssueCreator:
    """Classe para criar issues no GitHub usando a API."""
    
    def __init__(self, token: str, repo: str):
        """
        Inicializa o criador de issues.
        
        Args:
            token: Token de autenticação do GitHub
            repo: Repositório no formato 'owner/repo'
        """
        self.token = token
        self.repo = repo
        self.base_url = f"https://api.github.com/repos/{repo}"
        self.headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
        }
        self.created_issues = {}
        
    def create_issue(
        self,
        title: str,
        body: str,
        labels: Optional[List[str]] = None,
        milestone: Optional[int] = None,
    ) -> Dict:
        """
        Cria uma issue no GitHub.
        
        Args:
            title: Título da issue
            body: Corpo da issue (markdown)
            labels: Lista de labels
            milestone: ID do milestone
            
        Returns:
            Dict com informações da issue criada
        """
        url = f"{self.base_url}/issues"
        data = {
            "title": title,
            "body": body,
        }
        
        if labels:
            data["labels"] = labels
            
        if milestone:
            data["milestone"] = milestone
            
        response = requests.post(url, json=data, headers=self.headers)
        
        if response.status_code == 201:
            issue = response.json()
            print(f"✅ Issue criada: #{issue['number']} - {title}")
            return issue
        else:
            print(f"❌ Erro ao criar issue: {title}")
            print(f"   Status: {response.status_code}")
            print(f"   Resposta: {response.text}")
            return None
            
    def create_label(self, name: str, color: str, description: str = "") -> bool:
        """
        Cria uma label no repositório.
        
        Args:
            name: Nome da label
            color: Cor da label (hex sem #)
            description: Descrição da label
            
        Returns:
            True se criada com sucesso
        """
        url = f"{self.base_url}/labels"
        data = {
            "name": name,
            "color": color,
            "description": description,
        }
        
        response = requests.post(url, json=data, headers=self.headers)
        
        if response.status_code == 201:
            print(f"✅ Label criada: {name}")
            return True
        elif response.status_code == 422:
            # Label já existe
            print(f"ℹ️  Label já existe: {name}")
            return True
        else:
            print(f"❌ Erro ao criar label: {name}")
            return False
            
    def update_issue_with_dependencies(
        self,
        issue_number: int,
        blocked_by: List[int]
    ) -> bool:
        """
        Atualiza uma issue adicionando informação sobre dependências.
        
        Args:
            issue_number: Número da issue
            blocked_by: Lista de números de issues que bloqueiam esta
            
        Returns:
            True se atualizada com sucesso
        """
        if not blocked_by:
            return True
            
        # Buscar a issue atual
        url = f"{self.base_url}/issues/{issue_number}"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code != 200:
            return False
            
        issue = response.json()
        current_body = issue.get('body', '')
        
        # Adicionar seção de dependências
        dependency_text = "\n\n---\n\n**🔗 Dependências:**\n"
        for blocked_issue in blocked_by:
            dependency_text += f"- Bloqueada por #{blocked_issue}\n"
            
        new_body = current_body + dependency_text
        
        # Atualizar a issue
        data = {"body": new_body}
        response = requests.patch(url, json=data, headers=self.headers)
        
        return response.status_code == 200
        
    def create_all_labels(self):
        """Cria todas as labels necessárias."""
        labels_config = {
            # Fases
            "fase-1": ("0052CC", "Fase 1: Planejamento e Estruturação"),
            "fase-2": ("1D76DB", "Fase 2: Design e Prototipagem"),
            "fase-3": ("5319E7", "Fase 3: Desenvolvimento Backend"),
            "fase-4": ("B60205", "Fase 4: Desenvolvimento Frontend"),
            "fase-5": ("D93F0B", "Fase 5: Testes"),
            "fase-6": ("FBCA04", "Fase 6: Deploy e Infraestrutura"),
            "fase-7": ("0E8A16", "Fase 7: Documentação"),
            "fase-8": ("006B75", "Fase 8: Lançamento Beta"),
            "fase-9": ("1D76DB", "Fase 9: Versionamento e Release"),
            "fase-10": ("0052CC", "Fase 10: Pós-Lançamento"),
            
            # Categorias
            "planejamento": ("C2E0C6", "Atividades de planejamento"),
            "design": ("FFB6C1", "Design e UX"),
            "backend": ("4A5568", "Desenvolvimento backend"),
            "frontend": ("61DAFB", "Desenvolvimento frontend"),
            "testes": ("F9D0C4", "Testes e QA"),
            "devops": ("FEF2C0", "DevOps e infraestrutura"),
            "documentação": ("D4C5F9", "Documentação"),
            
            # Específicas
            "requisitos": ("BFD4F2", "Levantamento de requisitos"),
            "arquitetura": ("5319E7", "Arquitetura de sistema"),
            "tecnologia": ("1D76DB", "Decisões tecnológicas"),
            "configuração": ("0052CC", "Configuração de ambiente"),
            "design-system": ("FFB6C1", "Design system"),
            "ui-ux": ("FF69B4", "Interface e experiência do usuário"),
            "prototipagem": ("FFC0CB", "Prototipagem"),
            "validação": ("90EE90", "Validação com usuários"),
            "database": ("4A5568", "Banco de dados"),
            "autenticação": ("FFD700", "Autenticação e autorização"),
            "api": ("00BFFF", "APIs"),
            "pacientes": ("98D8C8", "Gestão de pacientes"),
            "agendamentos": ("F7DC6F", "Sistema de agendamentos"),
            "financeiro": ("52BE80", "Gestão financeira"),
            "setup": ("E8DAEF", "Configuração inicial"),
            "dashboard": ("AED6F1", "Dashboard e métricas"),
            "e2e": ("F9E79F", "Testes end-to-end"),
            "infraestrutura": ("FEF2C0", "Infraestrutura"),
            "ci-cd": ("F4D03F", "CI/CD"),
            "monitoramento": ("85929E", "Monitoramento"),
            "observabilidade": ("99A3A4", "Observabilidade"),
            "técnica": ("D4C5F9", "Documentação técnica"),
            "usuário": ("C39BD3", "Documentação de usuário"),
            "beta": ("3498DB", "Fase beta"),
            "preparação": ("AED6F1", "Preparação"),
            "feedback": ("5DADE2", "Feedback de usuários"),
            "release": ("27AE60", "Release"),
            "v1.0": ("229954", "Versão 1.0"),
            "marketing": ("E74C3C", "Marketing"),
            "comunicação": ("EC7063", "Comunicação"),
            "lançamento": ("27AE60", "Lançamento"),
            "produção": ("1E8449", "Produção"),
            "pós-lançamento": ("0052CC", "Pós-lançamento"),
            "manutenção": ("95A5A6", "Manutenção"),
            "suporte": ("7B7D7D", "Suporte"),
            "roadmap": ("48C9B0", "Roadmap de produto"),
            "evolução": ("45B39D", "Evolução contínua"),
            "stack": ("5319E7", "Stack tecnológica"),
            "versionamento": ("1D76DB", "Versionamento"),
            "processo": ("0052CC", "Processos"),
        }
        
        print("\n📋 Criando labels...\n")
        for label_name, (color, description) in labels_config.items():
            self.create_label(label_name, color, description)
            sleep(0.5)  # Evitar rate limiting
            
    def load_structure(self, file_path: str) -> Dict:
        """Carrega a estrutura de issues do arquivo YAML."""
        with open(file_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
            
    def create_all_issues(self, structure: Dict):
        """
        Cria todas as issues baseado na estrutura.
        
        Args:
            structure: Dicionário com a estrutura de issues
        """
        print("\n🚀 Criando issues das fases...\n")
        
        # Criar issues de fase (sem sub-issues por enquanto)
        for phase in structure.get('phases', []):
            phase_number = phase['number']
            title = phase['title']
            description = phase['description']
            labels = phase.get('labels', [])
            
            # Criar issue da fase
            issue = self.create_issue(title, description, labels)
            if issue:
                self.created_issues[phase_number] = issue['number']
                sleep(1)  # Evitar rate limiting
                
        print("\n🔧 Criando sub-issues...\n")
        
        # Criar sub-issues
        for phase in structure.get('phases', []):
            phase_number = phase['number']
            phase_issue_number = self.created_issues.get(phase_number)
            
            if not phase_issue_number:
                continue
                
            for sub_issue in phase.get('sub_issues', []):
                sub_title = sub_issue['title']
                sub_description = sub_issue['description']
                sub_labels = sub_issue.get('labels', [])
                
                # Adicionar referência à issue da fase
                full_description = f"{sub_description}\n\n---\n\n**Fase:** #{phase_issue_number}"
                
                # Criar sub-issue
                sub_issue_obj = self.create_issue(sub_title, full_description, sub_labels)
                if sub_issue_obj:
                    sub_issue_number = sub_issue['number']
                    self.created_issues[sub_issue_number] = sub_issue_obj['number']
                    sleep(1)
                    
        print("\n📚 Criando issues especiais...\n")
        
        # Criar issues especiais (Stack Tecnológica, Versionamento)
        for special in structure.get('special_issues', []):
            title = special['title']
            description = special['description']
            labels = special.get('labels', [])
            
            issue = self.create_issue(title, description, labels)
            if issue:
                special_number = special['number']
                self.created_issues[special_number] = issue['number']
                sleep(1)
                
        print("\n🔗 Atualizando dependências...\n")
        
        # Atualizar dependências
        for phase in structure.get('phases', []):
            phase_number = phase['number']
            phase_issue_number = self.created_issues.get(phase_number)
            blocked_by_numbers = phase.get('blocked_by', [])
            
            if phase_issue_number and blocked_by_numbers:
                # Converter números de fase para números de issue
                blocked_by_issues = [
                    self.created_issues.get(num) 
                    for num in blocked_by_numbers 
                    if self.created_issues.get(num)
                ]
                
                if blocked_by_issues:
                    self.update_issue_with_dependencies(
                        phase_issue_number,
                        blocked_by_issues
                    )
                    sleep(0.5)
                    
        print("\n✅ Processo concluído!\n")
        print(f"Total de issues criadas: {len(self.created_issues)}")
        print("\n📊 Resumo:")
        for key, number in sorted(self.created_issues.items(), key=lambda x: x[1]):
            print(f"  #{number}: Issue {key}")


def main():
    """Função principal."""
    parser = argparse.ArgumentParser(
        description="Cria todas as issues do PlenoPsi MVP no GitHub"
    )
    parser.add_argument(
        "--token",
        help="GitHub personal access token",
        default=os.environ.get("GITHUB_TOKEN"),
    )
    parser.add_argument(
        "--repo",
        help="Repositório no formato 'owner/repo'",
        default="datavisio-tech/pleno-psi",
    )
    parser.add_argument(
        "--structure-file",
        help="Caminho para o arquivo YAML com a estrutura",
        default="issues-structure.yaml",
    )
    parser.add_argument(
        "--skip-labels",
        help="Pular criação de labels",
        action="store_true",
    )
    
    args = parser.parse_args()
    
    if not args.token:
        print("❌ Erro: GITHUB_TOKEN não fornecido")
        print("   Use --token ou defina a variável de ambiente GITHUB_TOKEN")
        sys.exit(1)
        
    print("=" * 60)
    print("  PlenoPsi MVP - Criador de Issues")
    print("=" * 60)
    print(f"\nRepositório: {args.repo}")
    print(f"Estrutura: {args.structure_file}\n")
    
    # Criar instância do criador
    creator = GitHubIssueCreator(args.token, args.repo)
    
    # Criar labels
    if not args.skip_labels:
        creator.create_all_labels()
    
    # Carregar estrutura
    try:
        structure = creator.load_structure(args.structure_file)
    except FileNotFoundError:
        print(f"❌ Erro: Arquivo {args.structure_file} não encontrado")
        sys.exit(1)
    except yaml.YAMLError as e:
        print(f"❌ Erro ao ler YAML: {e}")
        sys.exit(1)
        
    # Criar issues
    creator.create_all_issues(structure)
    
    print("\n" + "=" * 60)
    print("  ✅ Todas as issues foram criadas com sucesso!")
    print("=" * 60)


if __name__ == "__main__":
    main()
