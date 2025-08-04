"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { apiClient } from "@/lib/api"

export default function CartPage() {
  const { user, isLoading, token } = useAuth()
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const success = updateQuantity(productId, newQuantity)
    if (!success) {
      toast({
        title: "❌ Quantité invalide",
        description: "Stock insuffisant ou quantité invalide",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0 || !token) return

    try {
      // Create order via API
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        total_amount: getTotalPrice(),
        payment_method: "whatsapp", // Since we're using WhatsApp for orders
      }

      const response = await apiClient.createOrder(orderData, token)

      if (response.order) {
        // Send WhatsApp message
        const orderDetails = items
          .map((item) => `• ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} XOF`)
          .join("\n")

        const message =
          `🛒 *Nouvelle Commande OPTIC-PROLINE*\n\n` +
          `📋 Commande #${response.order.id}\n` +
          `👤 Client: ${user?.name}\n` +
          `🏢 Entreprise: ${user?.company.name}\n` +
          `📧 Email: ${user?.email}\n\n` +
          `📦 *Détails de la commande:*\n${orderDetails}\n\n` +
          `💰 *Total: ${getTotalPrice().toLocaleString()} XOF*\n\n` +
          `📅 Date: ${new Date().toLocaleString("fr-FR")}`

        const whatsappUrl = `https://wa.me/2250797806347?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, "_blank")

        clearCart()
        toast({
          title: "✅ Commande créée",
          description: `Commande #${response.order.id} créée et envoyée via WhatsApp`,
          className: "bg-green-50 border-green-200 text-green-800",
        })

        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Order creation error:", error)
      toast({
        title: "❌ Erreur",
        description: error.message || "Erreur lors de la création de la commande",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-2 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingBag className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Mon Panier</h1>
            <span className="text-muted-foreground">
              ({items.length} article{items.length > 1 ? "s" : ""})
            </span>
          </div>

          {items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
                <p className="text-muted-foreground mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
                <Button asChild>
                  <a href="/">Continuer mes achats</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-muted-foreground">Prix unitaire: {item.price.toLocaleString()} XOF</p>
                          <p className="text-sm text-muted-foreground">Stock disponible: {item.maxStock}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                              className="w-20 text-center"
                              min="1"
                              max={item.maxStock}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxStock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} XOF</p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Résumé de la commande</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>{(item.price * item.quantity).toLocaleString()} XOF</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{getTotalPrice().toLocaleString()} XOF</span>
                      </div>
                    </div>

                    <Button onClick={handleCheckout} className="w-full" size="lg">
                      Passer la commande via WhatsApp
                    </Button>

                    <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
                      Vider le panier
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
