import {
	DataTableLayout,
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
	CATEGORIES_HEADER,
	type CategoryType,
	getCategoriesPage,
	getCategoryCount,
} from "@/queries/CategoryQueries";

export default async function CategoriesPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getCategoryCount();
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const items: CategoryType[] = await getCategoriesPage(page);

	return (
		<DataTableLayout<CategoryType>
			header={CATEGORIES_HEADER}
			totalPages={totalPages}
			rows={items}
			basePath="/categories"
		/>
	);
}
