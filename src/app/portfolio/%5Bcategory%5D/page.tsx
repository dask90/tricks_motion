import { CategoryLandingPage } from "@/app/pages/CategoryLandingPage";
import { categories } from "@/app/data/portfolioData";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  
  // Validate category (case-sensitive as per data)
  const isValidCategory = (categories as readonly string[]).includes(category);
  
  if (!isValidCategory || category === 'All') {
    notFound();
  }

  return <CategoryLandingPage category={category} />;
}

export async function generateStaticParams() {
  return categories
    .filter(cat => cat !== 'All')
    .map((cat) => ({
      category: cat,
    }));
}
