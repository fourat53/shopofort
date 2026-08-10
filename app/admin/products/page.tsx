import DataTableLayout, {
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { getProductCount, getProductsPage } from "@/queries/ProductQueries";
import { PRODUCTS_HEADER } from "./loading";

export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const { page: _pageParam, ...filterParams } = params;
	const totalCount = await getProductCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount, true);

	const products = await getProductsPage(page, filterParams);
	return (
		<DataTableLayout
			header={PRODUCTS_HEADER}
			totalPages={totalPages}
			entityRows={["products", products]}
			hasImage="multiple"
		/>
	);
}
