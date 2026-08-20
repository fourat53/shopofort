import { getCategoriesPage, getCategoryCount } from "@/actions/CategoryActions";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import {
	getTotalPages,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { CATEGORIES_HEADER } from "@/lib/entity/entity-header";
import type { Category } from "@/lib/entity/types";

export default async function CategoriesPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page, sortBy, order, ...filterParams } = params;

	const totalCount = await getCategoryCount(filterParams);
	const totalPages = getTotalPages(totalCount);

	const categories: Category[] = await getCategoriesPage(
		Number(page),
		filterParams,
		sortBy,
		order,
	);

	return (
		<DataTableLayout<Category>
			header={CATEGORIES_HEADER}
			totalPages={totalPages}
			rows={categories}
			basePath="categories"
			suspenseKey={params}
		/>
	);
}
