import { getProductCount, getProductsPage } from "@/actions/ProductActions";
import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { Product } from "@/lib/entity/types";
import { PRODUCTS_HEADER } from "./loading";

export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, ...filterParams } = params;

	const totalCount = await getProductCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount, true);

	const products: Product[] = await getProductsPage(page, filterParams);
	return (
		<DataTable<Product>
			header={PRODUCTS_HEADER}
			totalPages={totalPages}
			rows={products}
			basePath="products"
			hasImage="multiple"
		/>
	);
}
