import { IconArrowRight } from "@tabler/icons-react";
import { getCategoriesPage } from "@/actions/CategoryActions";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/entity/types";

export default async function PopularCategories() {
	const categories = await getCategoriesPage(1, "asc", "id", {}, 4);

	return (
		<section className="px-16 py-12">
			<div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
				<div>
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
						Popular Categories
					</h2>
					<p className="text-muted-foreground">
						Find exactly what you're looking for
					</p>
				</div>
				<Button
					variant="ghost"
					className="hover:bg-primary/10 hover:text-primary self-start md:self-auto"
				>
					View All <IconArrowRight className="ml-2 size-4" />
				</Button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{categories.map((category: Category, index: number) => (
					<CategoryCard key={index} category={category} index={index} />
				))}
			</div>
		</section>
	);
}

function CategoryCard({
	category,
	index,
}: {
	category: Category;
	index: number;
}) {
	return (
		<div
			key={category.id}
			className="group relative overflow-hidden rounded-3xl border bg-linear-to-br from-background to-muted/30 p-6 transition-all duration-300 hover:shadow-sm dark:hover:shadow-xl hover:-translate-y-1"
		>
			<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
			<div className="relative z-10 flex flex-col h-full">
				<div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
					<span className="font-bold text-lg">{index + 1}</span>
				</div>
				<h3 className="text-2xl font-bold mb-2 capitalize">{category.name}</h3>
				<p className="text-sm text-muted-foreground capitalize font-medium">
					{category.audience}
				</p>

				<div className="flex justify-end">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border shadow-sm text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
						<IconArrowRight className="size-4" />
					</div>
				</div>
			</div>
		</div>
	);
}
