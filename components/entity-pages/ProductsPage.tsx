import { getProductCount, getProductsPage } from "@/actions/ProductActions";
import type { PageProps } from "@/app/admin/[entity]/page";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { Product } from "@/lib/entity/types";

export default async function ProductsPage({
	searchParams,
	header,
}: PageProps) {
	const { page: _page, sortBy, order, ...filterParams } = searchParams;
	const totalCount = await getProductCount(filterParams);
	const { page, totalPages } = getPaginationParams(_page, totalCount);
	const products: Product[] = await getProductsPage(
		page,
		filterParams,
		sortBy,
		order,
	);
	return (
		<DataTableLayout<Product>
			header={header}
			totalPages={totalPages}
			rows={products}
			entity="products"
			hasImage="multiple"
		/>
	);
}
