#4 — Implementar tela de endereço e responsável legal (patient)

Descrição:

- Criar a interface de coleta de endereço (zip_code, street, number, neighborhood, city, state, country).
- Implementar lógica de responsável legal para pacientes:
  - Perguntar se paciente é responsável.
  - Se sim: usar dados do patient como responsável.
  - Se não: exibir formulário para criar responsável (email, senha, nome, cpf, phone).
- Regra de idade: se paciente < 18 anos, responsável é obrigatório.

Notas:

- Apenas UI/cliente nesta issue (sem backend ainda).
- Branch: `feature/cadastro`.
