import { CategoryLandingPage } from "@/app/pages/CategoryLandingPage";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  
  if (category === 'All') {
    notFound();
  }

  return <CategoryLandingPage category={category} />;
}
