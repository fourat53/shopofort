import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { Category } from "@/lib/types";
import { getCategoriesPage, getCategoryCount } from "@/queries/CategoryQueries";
import { CATEGORIES_HEADER } from "./loading";

export default async function CategoriesPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, ...filterParams } = params;

	const totalCount = await getCategoryCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const categories: Category[] = await getCategoriesPage(page, filterParams);

	return (
		<DataTable<Category>
			header={CATEGORIES_HEADER}
			totalPages={totalPages}
			rows={categories}
			basePath="categories"
		/>
	);
}
