import { Suspense } from "react";
import { getEntityCount } from "@/actions/EntityActions";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import DataTablePagination from "@/components/data-table/pagination/DataTablePagination";
import { getPaginationParams } from "@/components/data-table/pagination/PaginationParams";
import EntityTable from "@/components/entity-tables/EntityTable";
import { getHeader } from "@/lib/entity/headers";
import { EntityType } from "@/lib/entity/types";

const PAGE_SIZE = 20;
const IMAGE_PAGE_SIZE = 9;

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

	const hasImage = [EntityType.users, EntityType.products].includes(entity);
	const pageSize = hasImage ? IMAGE_PAGE_SIZE : PAGE_SIZE;

	const totalCount = await getEntityCount(entity, filterParams);
	const { page, totalPages } = getPaginationParams(_page, totalCount, pageSize);

	const header = getHeader(entity);

	const entityParams = {
		entity,
		header,
		page,
		order,
		sortBy,
		filterParams,
		pageSize,
	};

	return (
		<>
			<Suspense
				key={JSON.stringify(entityParams)}
				fallback={
					<DataTableSkeleton
						entity={entity}
						header={header}
						pageSize={pageSize}
					/>
				}
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
