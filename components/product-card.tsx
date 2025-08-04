"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  description: string
  unit_price: number
  batch_price: number
  stock_quantity: number
  status: "in_stock" | "out_of_stock" | "on_demand"
  brand: string
  material: string
  gender: string
  shape: string
  color: string
  category: {
    id: number
    name: string
  }
  is_in_stock: boolean
  formatted_price: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("optic-proline-favorites") || "[]")
    setIsFavorite(favorites.includes(product.id))
  }, [product.id])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("optic-proline-favorites") || "[]")
    let newFavorites

    if (isFavorite) {
      newFavorites = favorites.filter((id: number) => id !== product.id)
    } else {
      newFavorites = [...favorites, product.id]
    }

    localStorage.setItem("optic-proline-favorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits au panier",
        variant: "destructive",
      })
      return
    }

    const success = addToCart(product)
    if (success) {
      toast({
        title: "✅ Produit ajouté",
        description: `${product.name} ajouté au panier`,
        className: "bg-green-50 border-green-200 text-green-800",
      })
    } else {
      toast({
        title: "❌ Stock insuffisant",
        description: "Impossible d'ajouter plus de produits",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = () => {
    switch (product.status) {
      case "in_stock":
        return (
          <Badge variant="default" className="bg-green-500">
            {t("product.inStock")}
          </Badge>
        )
      case "out_of_stock":
        return <Badge variant="destructive">{t("product.outOfStock")}</Badge>
      case "on_demand":
        return <Badge variant="secondary">{t("product.onDemand")}</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={
            product.image
              ? `${product.image}`
              : `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name + " " + (product.brand ?? "") + " glasses")}`
          }
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={toggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
        <div className="absolute top-2 left-2">{getStatusBadge()}</div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {product.brand}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.category?.name}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.gender}
            </Badge>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-lg font-bold text-primary">{product.formatted_price}</p>
              {product.batch_price && <p className="text-sm text-muted-foreground">Lot: {product.batch_price} XOF</p>}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Stock: {product.stock_quantity}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button className="w-full" disabled={!product.is_in_stock} onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  )
}
