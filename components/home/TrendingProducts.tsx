import { IconArrowRight, IconTrendingUp } from "@tabler/icons-react";
import { getProductsPage } from "@/actions/ProductActions";
import ProductCard from "@/components/cards/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/entity/types";

export default async function TrendingProducts() {
	const products = await getProductsPage(1, "asc", "id", {}, 8);
	return (
		<section className="px-16 py-12 border-y">
			<div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
				<div className="flex items-center gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
						<IconTrendingUp className="h-6 w-6" />
					</div>
					<div>
						<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
							Trending Now
						</h2>
						<p className="text-muted-foreground mt-1">
							Our most popular items this week
						</p>
					</div>
				</div>
				<Button
					variant="ghost"
					className="hover:bg-primary/10 hover:text-primary self-start md:self-auto"
				>
					View All <IconArrowRight className="ml-2 size-4" />
				</Button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
				{products.map((product: Product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
