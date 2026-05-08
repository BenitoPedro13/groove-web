const automations = [
  { id: "auto-1", name: "Por do sol", status: "Ativa", trigger: "18:00" },
  { id: "auto-2", name: "Fim do expediente", status: "Pausada", trigger: "20:00" },
]

export default function AutomationsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Automations</h1>
        <p className="text-sm text-muted-foreground">Base inicial para regras de agendamento e eventos.</p>
      </header>
      <div className="space-y-3">
        {automations.map((automation) => (
          <article key={automation.id} className="rounded-2xl border border-border/60 bg-card p-4">
            <p className="font-medium">{automation.name}</p>
            <p className="text-xs text-muted-foreground">
              {automation.status} - disparo as {automation.trigger}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
