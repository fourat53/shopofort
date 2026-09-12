import {
	IconShoppingBag,
	IconShoppingCart,
	IconStarFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import { getProductsPage } from "@/actions/ProductActions";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/entity/types";

export default async function ProductsPage({
	searchParams,
}: {
	searchParams:
		| { categoryId?: string; categoryName?: string }
		| Promise<{ categoryId?: string; categoryName?: string }>;
}) {
	const resolvedParams = await Promise.resolve(searchParams);
	const categoryId = resolvedParams.categoryId;
	const categoryName = resolvedParams.categoryName;

	const filterParams: Record<string, string> = {};
	if (categoryId) filterParams.categoryId = categoryId;

	const products = await getProductsPage(1, "asc", "id", filterParams, 20);

	return (
		<div className="min-h-screen pt-24 pb-12 px-4 md:px-16">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-4xl font-bold mb-8 capitalize">
					{categoryName ? `${categoryName} Products` : "All Products"}
				</h1>
				{products.length === 0 ? (
					<p className="text-muted-foreground">No products found.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
						{products.map((product: Product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function ProductCard({ product }: { product: Product }) {
	return (
		<div className="group flex flex-col bg-transparent h-full">
			<div className="relative aspect-5/6 rounded-3xl bg-card overflow-hidden border shadow-sm transition-all duration-300 group-hover:shadow-md mb-4">
				{product.images?.[0] ? (
					<Image
						src={product.images[0]}
						alt={product.name}
						fill
						className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
					/>
				) : (
					<div className="flex flex-col gap-2 h-full w-full items-center justify-center bg-muted/60 text-muted-foreground/50">
						<IconShoppingBag className="size-12 opacity-50" />
						<span className="text-sm font-medium">No Image</span>
					</div>
				)}

				<div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
					<Button className="w-full shadow-lg gap-2 rounded-xl h-11">
						<IconShoppingCart className="size-4" /> Add to Cart
					</Button>
				</div>

				{product.inventory < 10 && (
					<div className="absolute top-4 left-4 rounded-full bg-destructive/90 backdrop-blur text-destructive-foreground px-3 py-1 text-xs font-bold shadow-sm">
						Low Stock
					</div>
				)}
			</div>

			<div className="flex flex-col px-1">
				<div className="flex justify-between items-start mb-1">
					<div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
						{product.brand || "Generic"}
					</div>
					<div className="flex items-center text-amber-500">
						<IconStarFilled className="h-3 w-3" />
						<span className="text-xs font-medium ml-1 text-foreground/70">
							4.8
						</span>
					</div>
				</div>
				<h3 className="font-bold text-lg mb-1 leading-tight line-clamp-1 group-hover:text-primary transition-colors">
					{product.name}
				</h3>
				<div className="mt-1 flex items-center gap-2 mt-auto">
					<span className="font-black text-xl">
						${Number(product.price).toFixed(2)}
					</span>
				</div>
			</div>
		</div>
	);
}
