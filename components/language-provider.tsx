"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Language = "fr" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  fr: {
    "nav.home": "Accueil",
    "nav.dashboard": "Tableau de bord",
    "nav.login": "Connexion",
    "nav.logout": "Déconnexion",
    "nav.profile": "Profil",
    "product.addToFavorites": "Ajouter aux favoris",
    "product.removeFromFavorites": "Retirer des favoris",
    "product.outOfStock": "Rupture de stock",
    "product.onDemand": "Sur commande",
    "product.inStock": "En stock",
    "auth.login": "Connexion",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.loginButton": "Se connecter",
    "auth.loginError": "Identifiants incorrects",
    "dashboard.overview": "Vue d'ensemble",
    "dashboard.orders": "Commandes",
    "dashboard.profile": "Profil",
    "order.create": "Passer commande",
    "order.payment": "Paiement",
    "order.success": "Commande créée avec succès",
    "payment.cash": "Espèces",
    "payment.creditCard": "Carte de crédit",
    "payment.mobileMoney": "Mobile Money",
    "payment.bankTransfer": "Virement bancaire",
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.price": "Prix",
    "common.brand": "Marque",
    "common.category": "Catégorie",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
  },
  en: {
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "nav.profile": "Profile",
    "product.addToFavorites": "Add to favorites",
    "product.removeFromFavorites": "Remove from favorites",
    "product.outOfStock": "Out of stock",
    "product.onDemand": "On demand",
    "product.inStock": "In stock",
    "auth.login": "Login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.loginButton": "Sign in",
    "auth.loginError": "Invalid credentials",
    "dashboard.overview": "Overview",
    "dashboard.orders": "Orders",
    "dashboard.profile": "Profile",
    "order.create": "Place order",
    "order.payment": "Payment",
    "order.success": "Order created successfully",
    "payment.cash": "Cash",
    "payment.creditCard": "Credit Card",
    "payment.mobileMoney": "Mobile Money",
    "payment.bankTransfer": "Bank Transfer",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.price": "Price",
    "common.brand": "Brand",
    "common.category": "Category",
    "common.save": "Save",
    "common.cancel": "Cancel",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("optic-proline-language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("optic-proline-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[Language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
