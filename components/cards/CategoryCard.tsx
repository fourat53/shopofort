import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import type { Category } from "@/lib/entity/types";

export default function CategoryCard({
	category,
	index,
}: {
	category: Category;
	index: number;
}) {
	return (
		<Link
			href={`/products?categoryId=${category.id}&categoryName=${encodeURIComponent(category.name)}`}
			className="block h-full"
		>
			<div
				key={category.id}
				className="group relative overflow-hidden rounded-3xl border bg-linear-to-br from-background to-muted/30 p-6 transition-all duration-300 hover:shadow-sm dark:hover:shadow-xl hover:-translate-y-1 h-full"
			>
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
	);
}
