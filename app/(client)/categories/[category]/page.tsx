import { getCategoriesPage } from "@/actions/CategoryActions";
import { PagesLayout, PagesTitle } from "@/app/(client)/layout";
import CategoryCard from "@/components/cards/CategoryCard";
import type { Category } from "@/lib/entity/types";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
	params,
}: {
	params: { category: string } | Promise<{ category: string }>;
}) {
	const resolvedParams = await Promise.resolve(params);
	const audience = resolvedParams.category;

	const categories = await getCategoriesPage({ audience }, 1, 999, "asc", "id");

	return (
		<PagesLayout>
			<PagesTitle>{audience} Categories</PagesTitle>
			{categories.length === 0 ? (
				<p className="text-muted-foreground">
					No categories found for {audience}.
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{categories.map((category: Category, index: number) => (
						<CategoryCard key={category.id} category={category} index={index} />
					))}
				</div>
			)}
		</PagesLayout>
	);
}
