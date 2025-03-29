import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  id: string
  title: string
  price: number
  currency?: string
  location: string
  image: string
  seller: {
    name: string
    avatar: string
  }
  createdAt: string
}

export default function ProductCard({
  id,
  title,
  price,
  currency = "$",
  location,
  image,
  seller,
  createdAt,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/marketplace/product/${id}`}>
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/80">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
      <CardContent className="p-3">
        <Link href={`/marketplace/product/${id}`}>
          <h3 className="font-semibold line-clamp-1 hover:underline">{title}</h3>
        </Link>
        <div className="flex justify-between items-center mt-1">
          <p className="font-bold text-lg">
            {currency}
            {price.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{seller.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">{createdAt}</span>
      </CardFooter>
    </Card>
  )
}

