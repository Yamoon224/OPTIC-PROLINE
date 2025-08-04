"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileDropzone } from "@/components/file-dropzone"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  Download,
  BarChart3,
  ShoppingCart,
  User,
} from "lucide-react"
import { apiClient } from "@/lib/api"

interface Order {
  id: number
  order_status: string
  total_amount: number
  created_at: string
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
  }>
}

export function DashboardTabs() {
  const { t } = useLanguage()
  const { user, token } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [companyData, setCompanyData] = useState({
    logo: null as File | null,
    register_id: "",
    address: "",
    contact: "",
  })
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    photo: null as File | null,
  })

  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getOrders(token!)

      if (response.orders) {
        setOrders(response.orders)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "❌ Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      })

      // Fallback to mock data if API fails
      const mockOrders = [
        {
          id: 1001,
          order_status: "delivered",
          total_amount: 1250.5,
          created_at: "2024-01-15T10:30:00Z",
          items: [
            { product_name: "Lunettes Élégantes Pro", quantity: 2, unit_price: 238.1 },
            { product_name: "Lunettes Tech Pro", quantity: 1, unit_price: 275.0 },
          ],
        },
        {
          id: 1002,
          order_status: "pending",
          total_amount: 680.0,
          created_at: "2024-01-20T14:15:00Z",
          items: [{ product_name: "Lunettes Premium Luxe", quantity: 1, unit_price: 680.0 }],
        },
        {
          id: 1003,
          order_status: "confirmed",
          total_amount: 445.0,
          created_at: "2024-01-18T09:45:00Z",
          items: [{ product_name: "Lunettes Executive", quantity: 1, unit_price: 450.0 }],
        },
        {
          id: 1004,
          order_status: "shipped",
          total_amount: 320.0,
          created_at: "2024-01-22T16:20:00Z",
          items: [{ product_name: "Lunettes Vintage Classic", quantity: 1, unit_price: 320.0 }],
        },
        {
          id: 1005,
          order_status: "cancelled",
          total_amount: 195.0,
          created_at: "2024-01-19T11:10:00Z",
          items: [{ product_name: "Lunettes Fashion Trend", quantity: 1, unit_price: 195.0 }],
        },
      ]
      setOrders(mockOrders)
    } finally {
      setLoading(false)
    }
  }

  const getOrderStats = () => {
    const stats = orders.reduce(
      (acc, order) => {
        acc[order.order_status] = (acc[order.order_status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(stats).map(([status, count]) => ({
      status,
      count,
      color: getStatusColor(status),
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f59e0b"
      case "confirmed":
        return "#3b82f6"
      case "shipped":
        return "#8b5cf6"
      case "delivered":
        return "#10b981"
      case "cancelled":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "secondary",
      confirmed: "default",
      shipped: "outline",
      delivered: "default",
      cancelled: "destructive",
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      const response = await apiClient.updateCompanyProfile(companyData, token)

      toast({
        title: "✅ Entreprise mise à jour",
        description: response.message || "Les informations de votre entreprise ont été mises à jour",
        className: "bg-green-50 border-green-200 text-green-800",
      })
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Erreur lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      const response = await apiClient.updateUserProfile(userData, token)

      toast({
        title: "✅ Profil mis à jour",
        description: response.message || "Vos informations ont été mises à jour",
        className: "bg-green-50 border-green-200 text-green-800",
      })
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message || "Erreur lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const exportToPDF = () => {
    toast({
      title: "Export PDF",
      description: "Fonctionnalité d'export PDF en cours de développement",
    })
  }

  const exportToExcel = () => {
    toast({
      title: "Export Excel",
      description: "Fonctionnalité d'export Excel en cours de développement",
    })
  }

  const orderStats = getOrderStats()
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          {t("dashboard.overview")}
        </TabsTrigger>
        <TabsTrigger value="orders" className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          {t("dashboard.orders")}
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {t("dashboard.profile")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} XOF</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter((o) => o.order_status === "pending").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Livrées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter((o) => o.order_status === "delivered").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {orderStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Évolution des commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="orders" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("dashboard.orders")}</CardTitle>
                <CardDescription>Gérez vos commandes</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={exportToExcel}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold">Commande #{order.id}</h3>
                        {getStatusBadge(order.order_status)}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.total_amount.toLocaleString()} XOF</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.items.map((item, index) => (
                        <span key={index}>
                          {item.product_name} (x{item.quantity}){index < order.items.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune commande trouvée</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>Modifiez les informations de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateCompany} className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo de l'entreprise</Label>
                  <FileDropzone
                    onFileSelect={(file) => setCompanyData({ ...companyData, logo: file })}
                    accept=".jpeg,.png,.jpg,.gif,.svg,.webp"
                    placeholder="Glissez le logo de votre entreprise ici"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-id">Numéro d'enregistrement</Label>
                  <Input
                    id="register-id"
                    value={companyData.register_id}
                    onChange={(e) => setCompanyData({ ...companyData, register_id: e.target.value })}
                    placeholder="Numéro d'enregistrement"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={companyData.address}
                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    placeholder="Adresse de l'entreprise"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={companyData.contact}
                    onChange={(e) => setCompanyData({ ...companyData, contact: e.target.value })}
                    placeholder="Informations de contact"
                  />
                </div>

                <Button type="submit" className="w-full">
                  {t("common.save")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Modifiez vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Nom</Label>
                  <Input
                    id="user-name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Votre nom"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    placeholder="Votre email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-phone">Téléphone</Label>
                  <Input
                    id="user-phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photo de profil</Label>
                  <FileDropzone
                    onFileSelect={(file) => setUserData({ ...userData, photo: file })}
                    accept=".jpeg,.png,.jpg,.gif,.svg,.webp"
                    placeholder="Glissez votre photo de profil ici"
                  />
                </div>

                <Button type="submit" className="w-full">
                  {t("common.save")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
