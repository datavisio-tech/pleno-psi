erDiagram

    USERS {
        uuid id PK
        string email
        string password_hash
        boolean is_active
        timestamp created_at
    }

    PERSONS {
        uuid id PK
        string full_name
        string cpf
        string email
        string phone
        date birth_date
        string gender
        timestamp created_at
    }

    ADDRESSES {
        uuid id PK
        string street
        string number
        string city
        string state
        string zip_code
        string country
    }

    CLINICS {
        uuid id PK
        string name
        string legal_name
        string cnpj
        uuid address_id FK
        uuid subscription_id FK
        timestamp created_at
    }

    CLINIC_USERS {
        uuid clinic_id FK
        uuid user_id FK
        string role
    }

    PROFESSIONALS {
        uuid id PK
        uuid person_id FK
        string professional_license
        string specialty
        numeric price
        timestamp created_at
    }

    CLINIC_PROFESSIONALS {
        uuid clinic_id FK
        uuid professional_id FK
        boolean active
    }

    PATIENTS {
        uuid id PK
        uuid person_id FK
        timestamp created_at
    }

    LEGAL_RESPONSIBLES {
        uuid id PK
        uuid person_id FK
        uuid billing_address_id FK
    }

    PATIENT_RESPONSIBLES {
        uuid patient_id FK
        uuid legal_responsible_id FK
        string type
    }

    APPOINTMENTS {
        uuid id PK
        uuid clinic_id FK
        uuid patient_id FK
        uuid professional_id FK
        timestamp start_time
        timestamp end_time
        string status
        numeric price
    }

    SUBSCRIPTION_PLANS {
        uuid id PK
        string name
        numeric price
        integer license_limit
    }

    SUBSCRIPTIONS {
        uuid id PK
        uuid clinic_id FK
        uuid plan_id FK
        string status
        date start_date
        date end_date
    }

    %% RELATIONSHIPS
    USERS ||--o{ CLINIC_USERS : manages
    CLINICS ||--o{ CLINIC_USERS : has

    PERSONS ||--|| PROFESSIONALS : "is"
    PERSONS ||--|| PATIENTS : "is"
    PERSONS ||--|| LEGAL_RESPONSIBLES : "is"

    CLINICS ||--o{ CLINIC_PROFESSIONALS : has
    PROFESSIONALS ||--o{ CLINIC_PROFESSIONALS : works_at

    PATIENTS ||--o{ PATIENT_RESPONSIBLES : has
    LEGAL_RESPONSIBLES ||--o{ PATIENT_RESPONSIBLES : responsible_for

    CLINICS ||--o{ APPOINTMENTS : schedules
    PROFESSIONALS ||--o{ APPOINTMENTS : attends
    PATIENTS ||--o{ APPOINTMENTS : receives

    SUBSCRIPTION_PLANS ||--o{ SUBSCRIPTIONS : defines
    CLINICS ||--|| SUBSCRIPTIONS : owns

    ADDRESSES ||--o{ CLINICS : located_at
    ADDRESSES ||--o{ LEGAL_RESPONSIBLES : billing_address

Requisitos do Sistema — SaaS Psi

1. Visão Geral

O SaaS Psi é uma plataforma de gestão clínica voltada para clínicas de psicologia, permitindo o gerenciamento de profissionais, pacientes, responsáveis legais, agendamentos e assinaturas, em um modelo multi-clínica e multi-usuário.

O sistema deve ser escalável, seguro e preparado para crescimento futuro, respeitando boas práticas de engenharia de software e modelagem de dados.

2. Conceitos Fundamentais do Domínio

Pessoa: representa dados civis e pessoais (nome, CPF, contato etc.).

Usuário: representa uma conta de acesso ao sistema (login).

Clínica: entidade central do negócio.

Profissional: psicólogo ou profissional de saúde.

Paciente: pessoa atendida pela clínica.

Responsável Legal/Financeiro: responsável por pacientes menores de idade ou responsável financeiro.

Agendamento: vínculo entre clínica, profissional e paciente.

Plano de Assinatura: define limites e funcionalidades do sistema.

3. Requisitos Funcionais
   3.1 Gestão de Clínicas

A clínica deve possuir cadastro básico com:

Nome fantasia

Razão social

CNPJ

Endereço

Informações legais

A clínica deve estar associada a um plano de assinatura.

Uma clínica pode possuir um ou mais usuários administradores.

Um usuário administrador pode gerenciar mais de uma clínica.

3.2 Gestão de Usuários e Autenticação

O sistema deve possuir autenticação de usuários.

Um usuário pode estar associado a uma ou mais clínicas.

Usuários possuem papéis distintos no contexto da clínica:

Super Administrador

Administrador

Profissional

O controle de permissões deve considerar o contexto da clínica.

3.3 Gestão de Pessoas

O sistema deve permitir o cadastro de pessoas, contendo:

Nome completo

CPF

E-mail

Telefone

Sexo

Data de nascimento

Endereço

Uma pessoa pode assumir diferentes papéis no sistema:

Paciente

Profissional

Responsável legal/financeiro

3.4 Gestão de Profissionais (Psicólogos)

A clínica deve conseguir cadastrar e gerenciar profissionais.

O profissional deve possuir:

Dados pessoais (via pessoa)

Registro profissional (CRP ou equivalente)

Especialidade

Preço do atendimento

Disponibilidade de agenda

Um profissional pode estar cadastrado em mais de uma clínica.

Uma clínica pode possuir vários profissionais.

3.5 Gestão de Pacientes

A clínica deve conseguir cadastrar e gerenciar pacientes.

O paciente deve possuir:

Nome completo

E-mail

Número de contato

Sexo

Idade ou data de nascimento

Um paciente pode estar associado a uma clínica.

Um paciente pode ter um responsável legal/financeiro.

3.6 Responsável Legal / Financeiro

O sistema deve permitir o cadastro de responsável legal ou financeiro.

O responsável deve possuir:

Nome

CPF

E-mail

Telefone

Endereço para faturamento e emissão de recibos

Um responsável pode estar associado a um ou mais pacientes.

Pacientes maiores de 18 anos podem ser seu próprio responsável financeiro.

3.7 Agendamentos

A clínica deve conseguir realizar agendamentos.

Um agendamento deve conter:

Clínica

Profissional

Paciente

Data e horário de início

Data e horário de término

Status (agendado, cancelado, realizado)

Valor do atendimento

Um profissional pode possuir vários agendamentos.

Um paciente pode possuir vários agendamentos.

A disponibilidade do profissional deve ser respeitada.

3.8 Planos de Assinatura e Licenças

A clínica deve possuir um plano de assinatura.

Um plano de assinatura pode conter:

Limite de licenças

Funcionalidades habilitadas

A clínica pode contratar uma ou mais licenças.

O acesso dos usuários deve respeitar os limites do plano contratado.

4. Requisitos de Relacionamento (Resumo)

Um usuário pode estar associado a várias clínicas.

Uma clínica pode ter vários usuários administradores.

Um profissional pode atuar em várias clínicas.

Uma clínica pode ter vários profissionais.

Uma clínica pode ter vários pacientes.

Um responsável legal pode estar associado a vários pacientes.

A relação entre profissional e paciente é N:N, mediada por agendamentos.

Uma clínica pode ter vários agendamentos.

Um agendamento possui exatamente um paciente e um profissional.

5. Requisitos Não Funcionais (Iniciais)

O sistema deve ser multi-tenant (isolamento por clínica).

O sistema deve garantir segurança dos dados (LGPD).

O sistema deve ser escalável.

O sistema deve possuir autenticação segura.

O código deve seguir boas práticas de organização e qualidade.

O sistema deve ser preparado para CI/CD.

6. Considerações de Evolução Futura

Integração com meios de pagamento

Emissão automática de recibos

Relatórios clínicos e financeiros

Integração com convênios

Notificações por e-mail e WhatsApp

Auditoria e histórico de alterações

7. Status do Documento

📌 Documento inicial de requisitos

🔄 Sujeito a evolução conforme validação do negócio

🧩 Base para modelagem de banco de dados e arquitetura
