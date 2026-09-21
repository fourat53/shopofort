import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { getCategoriesPage } from "@/actions/CategoryActions";
import CategoryCard from "@/components/cards/CategoryCard";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/entity/types";

export default async function PopularCategories() {
	const categories = await getCategoriesPage({}, 1, 4, "asc", "id");
	return (
		<section className="px-6 md:px-16 py-12 bg-background">
			<div className="flex flex-wrap items-end justify-between mb-6 gap-4">
				<div>
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
						Popular Categories
					</h2>
					<p className="text-muted-foreground">
						Find exactly what you're looking for
					</p>
				</div>
				<Link href={"/categories"}>
					<Button
						variant="ghost"
						className="hover:bg-primary/10 hover:text-primary self-start md:self-auto"
					>
						View All <IconArrowRight className="ml-2 size-4" />
					</Button>
				</Link>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{categories.map((category: Category, index: number) => (
					<CategoryCard key={index} category={category} index={index} />
				))}
			</div>
		</section>
	);
}
