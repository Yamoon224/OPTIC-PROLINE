"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { Search, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

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
  image: string
  category: {
    id: number
    name: string
  }
  is_in_stock: boolean
  formatted_price: string
}

const PRODUCTS_PER_PAGE = 12

export default function HomePage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedGender, setSelectedGender] = useState<string>("all")

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
    setCurrentPage(1) // Reset to first page when filters change
  }, [products, searchTerm, selectedBrand, selectedCategory, selectedGender])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getProducts()

      // console.log(response)
      if (response.data) {
        setProducts(response.data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "❌ " + t("common.error"),
        description: "Impossible de charger les produits",
        variant: "destructive",
      })

      // Fallback to mock data if API fails
      const mockProducts = [
        {
          id: 347,
          name: "Lunettes Élégantes Pro",
          description: "Lunettes de vue modernes avec monture en acétate premium",
          unit_price: 238.1,
          batch_price: 2542.99,
          stock_quantity: 262,
          status: "in_stock" as const,
          brand: "Macejkovic-Barrows",
          material: "Plastique",
          gender: "women",
          shape: "Cœur",
          color: "MediumPurple",
          category: { id: 417, name: "Bureau" },
          is_in_stock: true,
          formatted_price: "238 XOF",
        },
        {
          id: 348,
          name: "Lunettes Sport Vision",
          description: "Lunettes de sport avec protection UV et design ergonomique",
          unit_price: 185.5,
          batch_price: 1980.0,
          stock_quantity: 45,
          status: "on_demand" as const,
          brand: "SportVision",
          material: "Métal",
          gender: "men",
          shape: "Rectangulaire",
          color: "Noir",
          category: { id: 418, name: "Sport" },
          is_in_stock: false,
          formatted_price: "186 XOF",
        },
        // Add more products to test pagination...
        ...Array.from({ length: 20 }, (_, i) => ({
          id: 349 + i,
          name: `Lunettes Modèle ${i + 1}`,
          description: `Description du modèle ${i + 1} avec caractéristiques uniques`,
          unit_price: 150 + i * 10,
          batch_price: 1500 + i * 100,
          stock_quantity: Math.floor(Math.random() * 100) + 10,
          status: ["in_stock", "out_of_stock", "on_demand"][Math.floor(Math.random() * 3)] as const,
          brand: ["VintageOptic", "TechOptic", "FashionFrame", "Executive"][Math.floor(Math.random() * 4)],
          material: ["Plastique", "Métal", "Acétate", "Titane"][Math.floor(Math.random() * 4)],
          gender: ["men", "women"][Math.floor(Math.random() * 2)],
          shape: ["Rond", "Carré", "Rectangulaire", "Aviateur"][Math.floor(Math.random() * 4)],
          color: ["Noir", "Bleu", "Rouge", "Vert"][Math.floor(Math.random() * 4)],
          category: { id: 420 + i, name: ["Mode", "Sport", "Bureau", "Casual"][Math.floor(Math.random() * 4)] },
          is_in_stock: Math.random() > 0.3,
          formatted_price: `${150 + i * 10} XOF`,
        })),
      ]
      setProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category?.name === selectedCategory)
    }

    if (selectedGender !== "all") {
      filtered = filtered.filter((product) => product.gender === selectedGender)
    }

    setFilteredProducts(filtered)
  }

  const uniqueBrands = [...new Set(products.map((p) => p.brand))].sort()
  const uniqueCategories = [...new Set(products.map((p) => p.category?.name))].sort()
  const uniqueGenders = [...new Set(products.map((p) => p.gender))].sort()

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  if (loading) {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">OPTIC-PROLINE</h1>
          <p className="text-xl text-muted-foreground mb-8">Découvrez notre collection de lunettes premium</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t("common.brand")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les marques</SelectItem>
                  {uniqueBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t("common.category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {uniqueCategories.map((category, index) => (
                    <SelectItem key={`${category}-${index}`} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {uniqueGenders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender === "men" ? "Homme" : gender === "women" ? "Femme" : gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""} - Page {currentPage} sur {totalPages}
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setSelectedBrand("all")
                setSelectedCategory("all")
                setSelectedGender("all")
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit trouvé</p>
          </div>
        )}
      </main>
    </div>
  )
}
