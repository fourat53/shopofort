import { Suspense } from "react";
import { getEntityCount } from "@/actions/EntityActions";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import DataTablePagination from "@/components/data-table/pagination/DataTablePagination";
import { getPaginationParams } from "@/components/data-table/pagination/PaginationParams";
import EntityTable from "@/components/entity-tables/EntityTable";
import { getHeader } from "@/lib/entity/headers";
import type { EntityType } from "@/lib/entity/types";

interface EntityPageProps {
	params: Promise<{ entity: EntityType }>;
	searchParams: Promise<
		{
			page?: string;
			order?: "asc" | "desc";
			sortBy?: string;
		} & Record<string, string | string[] | undefined>
	>;
}

export default async function EntityPage({
	params,
	searchParams,
}: EntityPageProps) {
	const { entity } = await params;
	const { page: _page, sortBy, order, ...filterParams } = await searchParams;
	const withImage = ["users"].includes(entity);

	const totalCount = await getEntityCount(entity, filterParams);
	const { page, totalPages } = getPaginationParams(
		_page,
		totalCount,
		withImage,
	);

	const header = getHeader(entity);

	const entityParams = {
		entity,
		header,
		page,
		order,
		sortBy,
		filterParams,
	};

	return (
		<>
			<Suspense
				key={JSON.stringify(entityParams)}
				fallback={<DataTableSkeleton entity={entity} header={header} />}
			>
				<EntityTable {...entityParams} />
			</Suspense>
			{totalPages > 1 && (
				<DataTablePagination
					entity={entity}
					totalPages={totalPages}
					className="absolute bottom-15"
				/>
			)}
		</>
	);
}
