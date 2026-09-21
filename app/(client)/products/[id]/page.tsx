import { notFound } from "next/navigation";
import { PagesLayout } from "@/app/(client)/layout";
import ProductGallery from "@/components/cards/ProductGallery";
import ProductInfo from "@/components/cards/ProductInfo";
import { prisma } from "@/lib/prisma";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	const prod = await prisma.product.findUnique({
		where: { id: Number(id) },
		include: { category: true },
	});

	if (!prod) notFound();

	const product = JSON.parse(JSON.stringify(prod));

	return (
		<PagesLayout className="w-full flex items-center justify-center">
			<div className="p-5 sm:p-10 w-full bg-background border rounded-3xl grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
				<ProductGallery product={product} />
				<ProductInfo product={product} />
			</div>
		</PagesLayout>
	);
}
