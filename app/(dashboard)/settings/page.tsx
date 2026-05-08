export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configura IP manual, preferencia de tema e opcoes da LAN.</p>
      </header>
      <div className="rounded-2xl border border-border/60 bg-card p-4 text-sm text-muted-foreground">
        Proxima iteracao: formulario de IP fallback, scan interval e credenciais por dispositivo.
      </div>
    </section>
  )
}
