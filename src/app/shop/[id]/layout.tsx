import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  const { data } = await supabase.from('products').select('*').eq('id', id).single();
  
  if (!data) return {};

  const images = data.image ? data.image.split(',') : [];
  const imageUrl = images[0]?.trim() || '';

  return {
    title: `${data.name} | I LIKED`,
    description: data.description || "Check out this awesome product from I LIKED.",
    openGraph: {
      title: `${data.name} | I LIKED`,
      description: data.description || "Check out this awesome product from I LIKED.",
      images: [imageUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.name} | I LIKED`,
      description: data.description || "Check out this awesome product from I LIKED.",
      images: [imageUrl],
    }
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
