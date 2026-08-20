import { getProductCount, getProductsPage } from "@/actions/ProductActions";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import {
	getTotalPages,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { PRODUCTS_HEADER } from "@/lib/entity/entity-header";
import type { Product } from "@/lib/entity/types";

export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page, sortBy, order, ...filterParams } = params;

	const totalCount = await getProductCount(filterParams);
	const totalPages = getTotalPages(totalCount, true);

	const products: Product[] = await getProductsPage(
		Number(page),
		filterParams,
		sortBy,
		order,
	);

	return (
		<DataTableLayout<Product>
			header={PRODUCTS_HEADER}
			totalPages={totalPages}
			rows={products}
			basePath="products"
			suspenseKey={params}
			hasImage="multiple"
		/>
	);
}
