import { Metadata, ResolvingMetadata } from "next";
import { supabase } from "@/lib/supabase";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return {
      title: "Product Not Found | I LIKED",
    };
  }

  // Get the primary image
  const imageUrl = product.image ? product.image.split(',')[0].trim() : "https://iliked.in/images/logo.png";

  return {
    title: `${product.name} | I LIKED`,
    description: `${product.name} - ₹${product.price}. Premium oversized streetwear from I LIKED.`,
    openGraph: {
      title: `${product.name} | I LIKED`,
      description: `₹${product.price} - Premium oversized fit. Buy now at I LIKED.`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | I LIKED`,
      description: `₹${product.price} - Premium oversized fit.`,
      images: [imageUrl],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
