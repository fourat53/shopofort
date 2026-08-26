import { Suspense } from "react";
import { getEntityCount } from "@/actions/EntityActions";
import DataTablePagination from "@/components/data-table/DataTablePagination";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import CartItemsTable from "@/components/entity-tables/CartItemsTable";
import CartsTable from "@/components/entity-tables/CartsTable";
import CategoriesTable from "@/components/entity-tables/CategoriesTable";
import OrderItemsTable from "@/components/entity-tables/OrderItemsTable";
import OrdersTable from "@/components/entity-tables/OrdersTable";
import ProductsTable from "@/components/entity-tables/ProductsTable";
import UsersTable from "@/components/entity-tables/UsersTable";
import { getHeader, type HeaderItem } from "@/lib/entity/entity-header";
import { EntityType } from "@/lib/entity/types";

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
	const hasImage = ["users", "products"].includes(entity);

	const totalCount = await getEntityCount(entity, filterParams);
	const { page, totalPages } = getPaginationParams(_page, totalCount, hasImage);

	const header = getHeader(entity);

	const entityParams = {
		entity,
		header,
		page,
		order,
		sortBy,
		...filterParams,
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

interface EntityTableProps {
	entity: EntityType;
	header: HeaderItem[];
	page?: number;
	order?: "asc" | "desc";
	sortBy?: string;
	filterParams?: Record<string, string | string[] | undefined>;
}

async function EntityTable({ ...pageParams }: EntityTableProps) {
	switch (pageParams.entity) {
		case EntityType.users:
			return <UsersTable {...pageParams} />;
		case EntityType.products:
			return <ProductsTable {...pageParams} />;
		case EntityType.orders:
			return <OrdersTable {...pageParams} />;
		case EntityType.carts:
			return <CartsTable {...pageParams} />;
		case EntityType.categories:
			return <CategoriesTable {...pageParams} />;
		case EntityType["cart-items"]:
			return <CartItemsTable {...pageParams} />;
		case EntityType["order-items"]:
			return <OrderItemsTable {...pageParams} />;
	}
}

export type { EntityTableProps };
