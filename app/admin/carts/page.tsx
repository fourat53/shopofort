import {
	DataTableLayout,
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
	CARTS_HEADER,
	type CartType,
	getCartCount,
	getCartsPage,
} from "@/queries/CartQueries";

export default async function CartsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getCartCount();
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const carts: CartType[] = await getCartsPage(page);

	return (
		<DataTableLayout<CartType>
			header={CARTS_HEADER}
			totalPages={totalPages}
			rows={carts}
			basePath="/carts"
		/>
	);
}
