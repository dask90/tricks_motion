import { CategoryLandingPage } from "@/app/pages/CategoryLandingPage";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return <CategoryLandingPage category={decoded} />;
}
