"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { Moon, Sun, Globe, User, LogOut, Menu, X, Home, BarChart3, ShoppingCart } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const getLinkClasses = (path: string) => {
    const baseClasses = "text-sm font-medium hover:text-primary transition-colors border-b-2 pb-1"
    if (isActive(path)) {
      return `${baseClasses} ${theme === "dark" ? "border-white text-white" : "border-blue-800 text-blue-800"}`
    }
    return `${baseClasses} border-transparent`
  }

  const getLanguageClasses = (lang: string) => {
    const baseClasses = "flex items-center gap-2 border-b-2 pb-1"
    if (language === lang) {
      return `${baseClasses} ${theme === "dark" ? "border-white" : "border-blue-800"}`
    }
    return `${baseClasses} border-transparent`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.webp" alt="OPTIC-PROLINE" width={120} height={40} className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={getLinkClasses("/")}>
            <Home className="inline-block w-4 h-4 mr-2" />
            {t("nav.home")}
          </Link>
          {user && (
            <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
              <BarChart3 className="inline-block w-4 h-4 mr-2" />
              {t("nav.dashboard")}
            </Link>
          )}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-2">
          {user && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("fr")} className={getLanguageClasses("fr")}>
                🇫🇷 Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")} className={getLanguageClasses("en")}>
                🇺🇸 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">{t("nav.dashboard")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/register">S'inscrire</Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-4 h-4" />
              {t("nav.home")}
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                {t("nav.dashboard")}
              </Link>
            )}

            <div className="flex items-center space-x-2 pt-4 border-t">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "fr" ? "en" : "fr")}>
                {language === "fr" ? "🇺🇸 EN" : "🇫🇷 FR"}
              </Button>

              {user ? (
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("nav.logout")}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/register">S'inscrire</Link>
                  </Button>
                  <Button asChild variant="default" size="sm">
                    <Link href="/login">{t("nav.login")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
