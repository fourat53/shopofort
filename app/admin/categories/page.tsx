import { getCategoriesPage, getCategoryCount } from "@/actions/CategoryActions";
import DataTable from "@/components/data-table/DataTable";
import {
	getPaginationParams,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { CATEGORIES_HEADER } from "@/lib/entity/entity-header";
import type { Category } from "@/lib/entity/types";

export default async function CategoriesPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { sortBy, order, ...filterParams } = params;

	const totalCount = await getCategoryCount(filterParams);
	const { page, totalPages } = getPaginationParams(params.page, totalCount);

	const categories: Category[] = await getCategoriesPage(
		page,
		filterParams,
		sortBy,
		order,
	);

	return (
		<DataTable<Category>
			header={CATEGORIES_HEADER}
			totalPages={totalPages}
			rows={categories}
			basePath="categories"
			suspenseKey={params}
		/>
	);
}
