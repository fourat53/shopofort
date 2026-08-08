import DataTableLayout, {
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { getCategoriesPage, getCategoryCount } from "@/queries/CategoryQueries";
import { CATEGORIES_HEADER } from "./loading";

export default async function CategoriesPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getCategoryCount();
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const categories = await getCategoriesPage(page);

	return (
		<DataTableLayout
			header={CATEGORIES_HEADER}
			totalPages={totalPages}
			entityRows={["categories", categories]}
		/>
	);
}
