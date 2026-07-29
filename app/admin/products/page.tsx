import {
	DataTableLayout,
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import {
	getPaginationParams,
	IMAGE_PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import {
	getProductCount,
	getProductsPage,
	PRODUCTS_HEADER,
	type ProductType,
} from "@/queries/ProductQueries";

export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getProductCount();
	const { page, totalPages } = getPaginationParams(params, totalCount, true);

	const products: ProductType[] = await getProductsPage(page);
	const pageKey = params.page ?? "1";

	return (
		<DataTableLayout<ProductType>
			header={PRODUCTS_HEADER}
			totalPages={totalPages}
			rows={products}
			basePath="/products"
			hasImages
		/>
	);
}
