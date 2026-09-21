import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";
import { getUserProductRating } from "@/actions/ProductActions";
import { PagesLayout } from "@/app/(client)/layout";
import ProductGallery from "@/components/cards/ProductGallery";
import ProductInfo from "@/components/cards/ProductInfo";
import { prisma } from "@/lib/prisma";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;
	const productId = Number(id);

	const prod = await prisma.product.findUnique({
		where: { id: productId },
		include: { category: true },
	});

	if (!prod) notFound();

	const product = JSON.parse(JSON.stringify(prod));

	let userRating = 0;
	const { getUser } = getKindeServerSession();
	const user = await getUser();
	if (user) {
		userRating = await getUserProductRating(user.id, productId);
	}

	return (
		<PagesLayout className="w-full flex items-center justify-center">
			<div className="p-5 sm:p-10 w-full bg-background border rounded-3xl grid gap-10 lg:grid-cols-2 lg:gap-16">
				<ProductGallery product={product} />
				<ProductInfo product={product} userRating={userRating} />
			</div>
		</PagesLayout>
	);
}
