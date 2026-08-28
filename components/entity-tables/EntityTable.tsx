import CartItemsTable from "@/components/entity-tables/CartItemsTable";
import CartsTable from "@/components/entity-tables/CartsTable";
import CategoriesTable from "@/components/entity-tables/CategoriesTable";
import OrderItemsTable from "@/components/entity-tables/OrderItemsTable";
import OrdersTable from "@/components/entity-tables/OrdersTable";
import ProductsTable from "@/components/entity-tables/ProductsTable";
import UsersTable from "@/components/entity-tables/UsersTable";
import type { HeaderItem } from "@/lib/entity/entity-header";
import { EntityType } from "@/lib/entity/types";

interface EntityTableProps {
	entity: EntityType;
	header: HeaderItem[];
	page?: number;
	order?: "asc" | "desc";
	sortBy?: string;
	filterParams?: Record<string, string | string[] | undefined>;
}

export default async function EntityTable({ ...pageParams }: EntityTableProps) {
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
