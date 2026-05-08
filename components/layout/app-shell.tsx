"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, House, Lightbulb, Settings, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: House },
  { href: "/devices", label: "Devices", icon: Lightbulb },
  { href: "/scenes", label: "Scenes", icon: Sparkles },
  { href: "/automations", label: "Automations", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
]

type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl bg-background">
      <aside className="hidden w-64 flex-col border-r border-border/70 px-4 py-6 md:flex">
        <p className="mb-8 text-xl font-semibold">Groove</p>
        <nav className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => {
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
                {label}
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
          {navItems.map(({ href, label, icon: Icon }) => {
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
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
