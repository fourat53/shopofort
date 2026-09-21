import { getProductCount, getProductsPage } from "@/actions/ProductActions";
import { PagesLayout, PagesTitle } from "@/app/(client)/layout";
import ProductCard from "@/components/cards/ProductCard";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import type { Product } from "@/lib/entity/types";

export default async function ProductsPage({
	searchParams,
}: {
	searchParams:
		| {
				categoryId?: string;
				categoryName?: string;
				name?: string;
				page?: string;
		  }
		| Promise<{
				categoryId?: string;
				categoryName?: string;
				name?: string;
				page?: string;
		  }>;
}) {
	const resolvedParams = await Promise.resolve(searchParams);
	const categoryId = resolvedParams.categoryId;
	const categoryName = resolvedParams.categoryName;
	const name = resolvedParams.name;
	const page = Math.max(1, Number(resolvedParams.page) || 1);
	const pageSize = 12;

	const filterParams: Record<string, string> = {};
	if (categoryId) filterParams.categoryId = categoryId;
	if (name) filterParams.name = name;

	const [products, totalCount] = await Promise.all([
		getProductsPage(filterParams, page, pageSize, "asc", "id"),
		getProductCount(filterParams),
	]);

	const totalPages = Math.ceil(totalCount / pageSize);

	const createPageUrl = (pageNum: number) => {
		const params = new URLSearchParams();
		if (categoryId) params.set("categoryId", categoryId);
		if (categoryName) params.set("categoryName", categoryName);
		if (name) params.set("name", name);
		if (pageNum > 1) params.set("page", pageNum.toString());
		return `/products?${params.toString()}`;
	};

	return (
		<PagesLayout>
			<PagesTitle>
				{name
					? `Search: "${name}"`
					: categoryName
						? `${categoryName} Products`
						: "All Products"}
			</PagesTitle>
			{products.length === 0 ? (
				<p className="text-muted-foreground">No products found.</p>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
						{products.map((product: Product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
					{totalPages > 1 && (
						<Pagination
							className="mt-10 flex justify-center"
							aria-label="Products pagination"
						>
							<PaginationContent>
								{page > 1 && (
									<PaginationItem>
										<PaginationPrevious href={createPageUrl(page - 1)} />
									</PaginationItem>
								)}
								{Array.from({ length: totalPages }, (_, i) => i + 1).map(
									(pageNum) => {
										if (
											pageNum === 1 ||
											pageNum === totalPages ||
											(pageNum >= page - 1 && pageNum <= page + 1)
										) {
											return (
												<PaginationItem key={pageNum}>
													<PaginationLink
														href={createPageUrl(pageNum)}
														isActive={pageNum === page}
													>
														{pageNum}
													</PaginationLink>
												</PaginationItem>
											);
										}
										if (pageNum === page - 2 || pageNum === page + 2) {
											return (
												<PaginationItem key={pageNum}>
													<PaginationEllipsis />
												</PaginationItem>
											);
										}
										return null;
									},
								)}
								{page < totalPages && (
									<PaginationItem>
										<PaginationNext href={createPageUrl(page + 1)} />
									</PaginationItem>
								)}
							</PaginationContent>
						</Pagination>
					)}
				</>
			)}
		</PagesLayout>
	);
}
