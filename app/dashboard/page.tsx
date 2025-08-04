"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>{t("common.loading")}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("nav.dashboard")}</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user.name} - {user.company.name}
          </p>
        </div>

        <DashboardTabs />
      </main>
    </div>
  )
}
