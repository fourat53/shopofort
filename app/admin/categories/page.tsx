import DataTableLayout, {
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { getCategoriesPage, getCategoryCount } from "@/queries/CategoryQueries";
import { CATEGORIES_HEADER } from "./loading";

export default async function CategoriesPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const { page: _pageParam, ...filterParams } = params;
	const totalCount = await getCategoryCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const categories = await getCategoriesPage(page, filterParams);

	return (
		<DataTableLayout
			header={CATEGORIES_HEADER}
			totalPages={totalPages}
			entityRows={["categories", categories]}
		/>
	);
}
