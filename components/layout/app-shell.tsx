"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, House, Lightbulb, Settings, Sparkles } from "lucide-react"

import { useLanguage } from "@/components/providers/language-provider"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", labelKey: "navDashboard", icon: House },
  { href: "/devices", labelKey: "navDevices", icon: Lightbulb },
  { href: "/scenes", labelKey: "navScenes", icon: Sparkles },
  { href: "/automations", labelKey: "navAutomations", icon: Bot },
  { href: "/settings", labelKey: "navSettings", icon: Settings },
] as const

type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl bg-background">
      <aside className="hidden w-64 flex-col border-r border-border/70 px-4 py-6 md:flex">
        <div className="mb-8 space-y-3">
          <p className="text-xl font-semibold">{t.appName}</p>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            {t.language}
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as "pt" | "en")}
              className="rounded-md border border-border/70 bg-background px-2 py-1 text-xs text-foreground"
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {t[labelKey]}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="w-full pb-20 md:pb-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/70 bg-background/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-2 py-1 text-[11px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {t[labelKey]}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
