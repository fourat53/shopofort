import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { getCategoriesPage } from "@/actions/CategoryActions";
import type { Category } from "@/lib/entity/types";

export default async function CategoryPage({
	params,
}: {
	params: { category: string } | Promise<{ category: string }>;
}) {
	const resolvedParams = await Promise.resolve(params);
	const audience = resolvedParams.category;

	const categories = await getCategoriesPage(1, "asc", "id", { audience });

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
							<Link
								key={category.id}
								href={`/products?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
							>
								<div className="group relative overflow-hidden rounded-3xl border bg-linear-to-br from-background to-muted/30 p-6 transition-all duration-300 hover:shadow-sm dark:hover:shadow-xl hover:-translate-y-1 h-full cursor-pointer">
									<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
									<div className="relative z-10 flex flex-col h-full">
										<div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
											<span className="font-bold text-lg">{index + 1}</span>
										</div>
										<h3 className="text-2xl font-bold mb-2 capitalize">
											{category.name}
										</h3>
										<p className="text-sm text-muted-foreground capitalize font-medium">
											{category.audience}
										</p>

										<div className="flex justify-end mt-auto pt-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border shadow-sm text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
												<IconArrowRight className="size-4" />
											</div>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
