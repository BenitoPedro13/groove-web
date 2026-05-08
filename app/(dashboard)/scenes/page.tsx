import { mockEffects, mockScenes } from "@/lib/mocks/devices"

export default function ScenesPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Scenes</h1>
        <p className="text-sm text-muted-foreground">Cenas pre-definidas para aplicar rapidamente em grupos de dispositivos.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {mockScenes.map((scene) => {
          const effect = mockEffects.find((item) => item.id === scene.effectId)
          return (
            <article key={scene.id} className="rounded-2xl border border-border/60 bg-card p-4">
              <p className="font-medium">{scene.name}</p>
              <p className="text-xs text-muted-foreground">{scene.deviceIds.length} dispositivo(s)</p>
              <p className="mt-2 text-xs text-muted-foreground">Efeito: {effect?.name ?? "Sem efeito"}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
