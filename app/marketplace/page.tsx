import MainLayout from "@/components/layout/main-layout"
import ProductCard from "@/components/marketplace/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Plus, Search } from "lucide-react"
import Link from "next/link"

// Sample data
const products = [
  {
    id: "product1",
    title: "Vintage Camera",
    price: 199.99,
    location: "San Francisco",
    image: "/placeholder.svg",
    seller: {
      name: "Alex Chen",
      avatar: "/placeholder-user.jpg",
    },
    createdAt: "2 days ago",
    category: "electronics",
  },
  {
    id: "product2",
    title: "Mountain Bike",
    price: 349.99,
    location: "Los Angeles",
    image: "/placeholder.svg",
    seller: {
      name: "Maria Garcia",
      avatar: "/placeholder-user.jpg",
    },
    createdAt: "1 day ago",
    category: "vehicles",
  },
  {
    id: "product3",
    title: "Leather Sofa",
    price: 599.99,
    location: "New York",
    image: "/placeholder.svg",
    seller: {
      name: "James Wilson",
      avatar: "/placeholder-user.jpg",
    },
    createdAt: "3 hours ago",
    category: "furniture",
  },
  {
    id: "product4",
    title: "iPhone 13",
    price: 649.99,
    location: "Chicago",
    image: "/placeholder.svg",
    seller: {
      name: "Emma Davis",
      avatar: "/placeholder-user.jpg",
    },
    createdAt: "5 hours ago",
    category: "electronics",
  },
  {
    id: "product5",
    title: "Desk Chair",
    price: 129.99,
    location: "Seattle",
    image: "/placeholder.svg",
    seller: {
      name: "Michael Brown",
      avatar: "/placeholder-user.jpg",
    },
    createdAt: "Yesterday",
    category: "furniture",
  },
  {
    id: "product6",
    title: "Designer Bag",
    price: 299.99,
    location: "Miami",
    image: "/placeholder.svg",
    seller: {
      name: "Sophia Lee",
      avatar: "/placeholder-user.jpg",
    },
    createdAt: "4 days ago",
    category: "clothing",
  },
]

export default function MarketplacePage() {
  return (
    <MainLayout showRightSidebar={false}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell items in your local community</p>
        </div>
        <Button asChild>
          <Link href="/marketplace/sell">
            <Plus className="h-4 w-4 mr-2" />
            Sell Something
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search marketplace..." className="pl-8" />
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="electronics">Electronics</TabsTrigger>
          <TabsTrigger value="furniture">Furniture</TabsTrigger>
          <TabsTrigger value="clothing">Clothing</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                location={product.location}
                image={product.image}
                seller={product.seller}
                createdAt={product.createdAt}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="electronics" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products
              .filter((product) => product.category === "electronics")
              .map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  location={product.location}
                  image={product.image}
                  seller={product.seller}
                  createdAt={product.createdAt}
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="furniture" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products
              .filter((product) => product.category === "furniture")
              .map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  location={product.location}
                  image={product.image}
                  seller={product.seller}
                  createdAt={product.createdAt}
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="clothing" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products
              .filter((product) => product.category === "clothing")
              .map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  location={product.location}
                  image={product.image}
                  seller={product.seller}
                  createdAt={product.createdAt}
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="vehicles" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products
              .filter((product) => product.category === "vehicles")
              .map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  location={product.location}
                  image={product.image}
                  seller={product.seller}
                  createdAt={product.createdAt}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  )
}

