import {
	DataTableLayout,
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
	getProductCount,
	getProductsPage,
	PRODUCTS_HEADER,
} from "@/queries/ProductQueries";

export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getProductCount();
	const { page, totalPages } = getPaginationParams(params, totalCount, true);

	const products = await getProductsPage(page);
	return (
		<DataTableLayout
			header={PRODUCTS_HEADER}
			totalPages={totalPages}
			entityRows={["products", products]}
			hasImage="multiple"
		/>
	);
}
