import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { parseProductTag } from '@/lib/db';

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  const { data } = await supabase.from('products').select('*').eq('id', id).single();
  
  if (!data) {
    return {
      title: 'Product Not Found | I LIKED™',
      description: 'The requested streetwear product could not be found.',
    };
  }

  const images = data.image ? data.image.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  const imageUrl = images[0] || 'https://iliked.in/images/logo.png';
  const categoryName = data.category || 'Oversized Streetwear';
  const colorName = data.color || 'Signature';
  
  const seoDescription = data.description 
    ? `${data.name} - ${data.description.slice(0, 140)}... Shop at ₹${data.price} with fast shipping & COD across India.`
    : `Buy ${data.name} (${colorName}) ${categoryName} online at ₹${data.price}. Heavyweight 100% cotton, drop shoulder fit with bold comic pop-art aesthetic. Fast shipping in India.`;

  return {
    title: `${data.name} - Oversized Streetwear T-Shirt`,
    description: seoDescription,
    keywords: [
      data.name,
      `${data.name} t shirt`,
      "oversized streetwear t shirt",
      "graphic tee India",
      data.category || "oversized tees",
      data.color || "streetwear",
      "I LIKED apparel",
      "buy streetwear online India"
    ],
    alternates: {
      canonical: `https://iliked.in/shop/${id}`,
    },
    openGraph: {
      title: `${data.name} | I LIKED™ Streetwear`,
      description: seoDescription,
      url: `https://iliked.in/shop/${id}`,
      siteName: 'I LIKED™',
      locale: 'en_IN',
      type: 'website',
      images: images.map((img: string) => ({
        url: img,
        width: 800,
        height: 1000,
        alt: `${data.name} - I LIKED Streetwear`,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} | I LIKED™`,
      description: seoDescription,
      images: [imageUrl],
      creator: '@iliked_in',
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();

  if (!product) {
    return <>{children}</>;
  }

  const images = product.image ? product.image.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  const tagData = parseProductTag(product.tag);
  
  // Calculate average rating from reviews if available
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 
    ? (reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 5), 0) / reviewCount).toFixed(1)
    : "5.0";

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images.length > 0 ? images : ['https://iliked.in/images/logo.png'],
    description: product.description || `Premium ${product.category || 'Oversized'} streetwear graphic tee by I LIKED.`,
    sku: `ILIKED-${product.id}`,
    mpn: `ILIKED-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'I LIKED',
    },
    offers: {
      '@type': 'Offer',
      url: `https://iliked.in/shop/${product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: tagData.isPreorder 
        ? 'https://schema.org/PreOrder' 
        : product.stock > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'I LIKED',
      },
    },
    ...(reviewCount > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
      review: reviews.map((r: any) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.name || 'Verified Buyer',
        },
        datePublished: r.date ? r.date.split('T')[0] : '2024-01-01',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating || 5,
          bestRating: '5',
          worstRating: '1',
        },
        reviewBody: r.comment || 'Awesome quality fit and print!',
      })),
    } : {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '1',
        bestRating: '5',
        worstRating: '1',
      }
    }),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://iliked.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://iliked.in/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://iliked.in/shop/${product.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
