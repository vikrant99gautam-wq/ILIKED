"use client";
import { useEffect, useState } from "react";

type ReviewEntry = {
  name: string;
  rating: number;
  comment: string;
  date: string;
  product_id: number;
  product_name: string;
  raw_index: number;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products");
      const products = await res.json();
      
      const aggregated: ReviewEntry[] = [];
      
      products.forEach((product: any) => {
        if (product.reviews && Array.isArray(product.reviews)) {
          product.reviews.forEach((review: any, index: number) => {
            aggregated.push({
              name: review.name || "Anonymous",
              rating: review.rating || 5,
              comment: review.comment || "",
              date: review.date || new Date().toISOString(),
              product_id: product.id,
              product_name: product.name,
              raw_index: index, // To safely identify which review to delete
            });
          });
        }
      });
      
      // Sort newest first
      aggregated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setReviews(aggregated);
    } catch (e) {
      console.error("Failed to fetch reviews", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (productId: number, rawIndex: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    setIsLoading(true);
    try {
      // 1. Fetch current product
      const pRes = await fetch(`/api/products/${productId}`);
      const product = await pRes.json();
      
      // 2. Filter out the review at rawIndex
      if (product.reviews && Array.isArray(product.reviews)) {
        const updatedReviews = product.reviews.filter((_: any, idx: number) => idx !== rawIndex);
        
        // 3. Update the product
        await fetch(`/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviews: updatedReviews }),
        });
        
        // Refresh the list
        await fetchReviews();
      }
    } catch (e) {
      console.error("Failed to delete review", e);
      alert("Error deleting review");
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="p-6 md:p-10 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-cartoon text-4xl md:text-5xl uppercase tracking-widest drop-shadow-[2px_2px_0_var(--color-electric-blue)]">
          MANAGE REVIEWS
        </h1>
        <button 
          onClick={fetchReviews}
          className="px-6 py-2 border-[3px] border-black bg-white hover:bg-[#FFD700] font-black uppercase shadow-[4px_4px_0_#111] transition-all active:translate-y-1 active:shadow-[0px_0px_0_#111]"
        >
          REFRESH
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 font-cartoon text-3xl animate-pulse">LOADING REVIEWS...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 border-[4px] border-dashed border-black bg-white">
          <h2 className="font-cartoon text-3xl">NO REVIEWS FOUND</h2>
          <p className="font-black text-gray-500 uppercase tracking-widest mt-2">Looks like nobody said anything yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border-[4px] border-black shadow-[8px_8px_0_#111]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white font-cartoon text-xl tracking-widest">
                <th className="p-4 border-b-[4px] border-black">DATE</th>
                <th className="p-4 border-b-[4px] border-black">PRODUCT</th>
                <th className="p-4 border-b-[4px] border-black">CUSTOMER</th>
                <th className="p-4 border-b-[4px] border-black">RATING</th>
                <th className="p-4 border-b-[4px] border-black">REVIEW</th>
                <th className="p-4 border-b-[4px] border-black text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, idx) => (
                <tr key={`${review.product_id}-${review.raw_index}-${idx}`} className="border-b-[2px] border-dashed border-gray-300 hover:bg-[#F4F4F0] transition-colors">
                  <td className="p-4 font-mono text-sm whitespace-nowrap">
                    {new Date(review.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-black uppercase text-sm">
                    {review.product_name}
                  </td>
                  <td className="p-4 font-bold uppercase text-sm">
                    {review.name}
                  </td>
                  <td className="p-4 text-[#FFD700] text-xl drop-shadow-[1px_1px_0_#111] whitespace-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="p-4 font-mono text-sm italic text-gray-700 min-w-[200px] max-w-[400px]">
                    "{review.comment}"
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteReview(review.product_id, review.raw_index)}
                      className="px-4 py-1 border-[2px] border-black bg-[var(--color-coral-red)] hover:bg-black text-white font-black text-xs transition-colors uppercase"
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
