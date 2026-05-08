"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { mockEffects, mockScenes } from "@/lib/mocks/devices"

export default function ScenesPage() {
  const { t } = useLanguage()

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t.scenesTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.scenesSubtitle}</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {mockScenes.map((scene) => {
          const effect = mockEffects.find((item) => item.id === scene.effectId)
          return (
            <article key={scene.id} className="rounded-2xl border border-border/60 bg-card p-4">
              <p className="font-medium">{scene.name}</p>
              <p className="text-xs text-muted-foreground">
                {scene.deviceIds.length} {t.sceneDevices}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t.sceneEffect}: {effect?.name ?? t.noEffect}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
