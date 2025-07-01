import { ProductForm } from "../components/product-form";
import { Metadata } from "next";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit product details and settings",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm productId={params.id} />
    </div>
  );
}
