import { unstable_cache } from "next/cache";
import { IMAGE_PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { CACHE_REVALIDATE_SECONDS, prisma } from "@/lib/prisma";

const PRODUCTS_HEADER: string[] = [
	"Product ID",
	"Name",
	"Price ($)",
	"Brand",
	"Inventory",
	"Description",
	"Category ID",
	"Images",
] as const;

const getProductCount = unstable_cache(
	async () => prisma.product.count(),
	["products-count"],
	{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] },
);

function getProductsPage(page: number) {
	return unstable_cache(
		async () => {
			const products = await prisma.product.findMany({
				skip: (page - 1) * IMAGE_PAGE_SIZE,
				take: IMAGE_PAGE_SIZE,
				orderBy: { id: "asc" },
			});
			return products.map(({ id, name, price, ...rest }) => ({
				id,
				name,
				price: Number(price),
				...rest,
			}));
		},
		["products-page", String(page)],
		{ revalidate: CACHE_REVALIDATE_SECONDS, tags: ["products"] },
	)();
}

export { getProductCount, getProductsPage, PRODUCTS_HEADER };
