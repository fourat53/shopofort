import { getCategoriesPage, getCategoryCount } from "@/actions/CategoryActions";
import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { CATEGORIES_HEADER } from "@/lib/entity/entity-header";
import type { Category } from "@/lib/entity/types";

export default async function CategoriesPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, sortBy, order, ...filterParams } = params;

	const totalCount = await getCategoryCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const categories: Category[] = await getCategoriesPage(page, filterParams, {
		sortBy,
		order,
	});

	const suspenseKey = JSON.stringify(params);

	return (
		<DataTable<Category>
			header={CATEGORIES_HEADER}
			totalPages={totalPages}
			rows={categories}
			basePath="categories"
			suspenseKey={suspenseKey}
		/>
	);
}
