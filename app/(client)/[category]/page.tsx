import { getCategoriesPage } from "@/actions/CategoryActions";
import CategoryCard from "@/components/cards/CategoryCard";
import type { Category } from "@/lib/entity/types";

export default async function CategoryPage({
	params,
}: {
	params: { category: string } | Promise<{ category: string }>;
}) {
	const resolvedParams = await Promise.resolve(params);
	const audience = resolvedParams.category;

	const categories = await getCategoriesPage({ audience }, 1, 999, "asc", "id");

	return (
		<div className="min-h-screen pt-24 px-4 md:px-16">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-4xl font-bold mb-8 capitalize">
					{audience} Categories
				</h1>
				{categories.length === 0 ? (
					<p className="text-muted-foreground">
						No categories found for {audience}.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{categories.map((category: Category, index: number) => (
							<CategoryCard
								key={category.id}
								category={category}
								index={index}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
