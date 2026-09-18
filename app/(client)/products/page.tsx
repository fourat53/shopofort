import { getProductsPage } from "@/actions/ProductActions";
import ProductCard from "@/components/cards/ProductCard";
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

	const products = await getProductsPage(filterParams, 1, 20, "asc", "id");

	return (
		<div className="p-10">
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
	);
}
