import MainLayout from "@/components/layout/main-layout"
import ProductListingForm from "@/components/marketplace/product-listing-form"

export default function SellPage() {
  return (
    <MainLayout showRightSidebar={false}>
      <h1 className="text-2xl font-bold mb-6">Sell an Item</h1>
      <ProductListingForm />
    </MainLayout>
  )
}

