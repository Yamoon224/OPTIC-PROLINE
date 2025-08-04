"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { FileDropzone } from "@/components/file-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, Building, User, Eye, EyeOff } from "lucide-react"
import { apiClient } from "@/lib/api"

interface CompanyData {
  name: string
  logo: File | null
  register_id: string
  address: string
  contact: string
}

interface UserData {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  photo: File | null
}

export default function RegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    logo: null,
    register_id: "",
    address: "",
    contact: "",
  })

  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "+225",
    password: "",
    password_confirmation: "",
    photo: null,
  })

  const validateStep1 = () => {
    if (!companyData.name || !companyData.register_id || !companyData.address || !companyData.contact) {
      toast({
        title: "❌ Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!userData.name || !userData.email || !userData.phone || !userData.password) {
      toast({
        title: "❌ Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return false
    }

    if (userData.password.length < 8) {
      toast({
        title: "❌ Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      })
      return false
    }

    if (userData.password !== userData.password_confirmation) {
      toast({
        title: "❌ Mots de passe différents",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      toast({
        title: "❌ Email invalide",
        description: "Veuillez saisir un email valide",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return

    setLoading(true)
    try {
      const response = await apiClient.register(companyData, userData)

      toast({
        title: "✅ Inscription réussie",
        description: response.message || "Votre compte a été créé avec succès",
        className: "bg-green-50 border-green-200 text-green-800",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "❌ Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                {currentStep === 1 ? <Building className="h-6 w-6" /> : <User className="h-6 w-6" />}
                {currentStep === 1 ? "Informations de l'entreprise" : "Informations utilisateur"}
              </CardTitle>
              <CardDescription>
                Étape {currentStep} sur 2 - {currentStep === 1 ? "Créez votre entreprise" : "Créez votre compte"}
              </CardDescription>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                ></div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentStep === 1 ? (
                // Step 1: Company Information
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nom de l'entreprise *</Label>
                    <Input
                      id="company-name"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      placeholder="Nom de votre entreprise"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Logo de l'entreprise</Label>
                    <FileDropzone
                      onFileSelect={(file) => setCompanyData({ ...companyData, logo: file })}
                      accept=".jpeg,.png,.jpg,.gif,.svg,.webp"
                      placeholder="Glissez le logo de votre entreprise ici"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-id">Numéro d'enregistrement *</Label>
                    <Input
                      id="register-id"
                      value={companyData.register_id}
                      onChange={(e) => setCompanyData({ ...companyData, register_id: e.target.value })}
                      placeholder="Numéro d'enregistrement de l'entreprise"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={companyData.address}
                      onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                      placeholder="Adresse de l'entreprise"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact *</Label>
                    <Input
                      id="contact"
                      value={companyData.contact}
                      onChange={(e) => setCompanyData({ ...companyData, contact: e.target.value })}
                      placeholder="Informations de contact"
                      required
                    />
                  </div>

                  <Button onClick={handleNext} className="w-full">
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                // Step 2: User Information
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Nom complet *</Label>
                    <Input
                      id="user-name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">🇨🇮 +225</div>
                      <Input
                        id="phone"
                        value={userData.phone.replace("+225", "")}
                        onChange={(e) => setUserData({ ...userData, phone: "+225" + e.target.value })}
                        placeholder="0123456789"
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        placeholder="Minimum 8 caractères"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Confirmer le mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="password-confirm"
                        type={showPasswordConfirm ? "text" : "password"}
                        value={userData.password_confirmation}
                        onChange={(e) => setUserData({ ...userData, password_confirmation: e.target.value })}
                        placeholder="Confirmez votre mot de passe"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      >
                        {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Photo de profil</Label>
                    <FileDropzone
                      onFileSelect={(file) => setUserData({ ...userData, photo: file })}
                      accept=".jpeg,.png,.jpg,.gif,.svg,.webp"
                      placeholder="Glissez votre photo de profil ici"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Précédent
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                      {loading ? "Inscription..." : "S'inscrire"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
