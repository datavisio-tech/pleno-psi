export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-bold tracking-tight text-sky-700 dark:text-sky-400">
            PlenoPsi
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Gestão completa para profissionais de psicologia
          </p>
        </div>

        <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-lg font-semibold text-sky-700 dark:text-sky-400">
              📅 Agenda
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Agendamento inteligente de consultas com notificações.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-lg font-semibold text-sky-700 dark:text-sky-400">
              💰 Financeiro
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Controle de recebimentos, despesas e relatórios.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-lg font-semibold text-sky-700 dark:text-sky-400">
              🧠 Pacientes
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Histórico de atendimentos e evolução clínica.
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-zinc-400">
          © 2026 PlenoPsi — Todos os direitos reservados.
        </p>
      </main>
    </div>
  );
}
