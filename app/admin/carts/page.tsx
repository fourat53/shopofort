import DataTableLayout, {
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { getCartCount, getCartsPage } from "@/queries/CartQueries";
import { CARTS_HEADER } from "./loading";

export default async function CartsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getCartCount();
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const carts = await getCartsPage(page);

	return (
		<DataTableLayout
			header={CARTS_HEADER}
			totalPages={totalPages}
			entityRows={["carts", carts]}
		/>
	);
}
