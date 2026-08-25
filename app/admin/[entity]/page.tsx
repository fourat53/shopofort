import { Suspense } from "react";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import CartItemsPage from "@/components/entity-pages/CartItemsPage";
import CartsPage from "@/components/entity-pages/CartsPage";
import CategoriesPage from "@/components/entity-pages/CategoriesPage";
import OrderItemsPage from "@/components/entity-pages/OrderItemsPage";
import OrdersPage from "@/components/entity-pages/OrdersPage";
import ProductsPage from "@/components/entity-pages/ProductsPage";
import UsersPage from "@/components/entity-pages/UsersPage";
import type { Entity } from "@/lib/entity/current-entity";
import {
	getHeader,
	type HasImage,
	type HeaderType,
} from "@/lib/entity/entity-header";

type SearchParams = {
	page?: string;
	sortBy?: string;
	order?: "asc" | "desc";
} & Record<string, string | string[] | undefined>;

interface EntitySectionProps {
	params: Promise<{ entity: Entity }>;
	searchParams: Promise<SearchParams>;
}

export default async function EntitySection({
	params,
	searchParams,
}: EntitySectionProps) {
	const { entity } = await params;
	const resolvedParams = await searchParams;
	const header = getHeader(entity);

	const hasImage: HasImage =
		entity === "products" ? "multiple" : entity === "users" ? "one" : "none";
	return (
		<Suspense
			key={JSON.stringify(resolvedParams)}
			fallback={
				<DataTableSkeleton
					entity={entity}
					header={header}
					hasImage={hasImage}
				/>
			}
		>
			<EntityPage
				entity={entity}
				header={header}
				searchParams={resolvedParams}
			/>
		</Suspense>
	);
}

interface PageProps {
	searchParams: SearchParams;
	header: HeaderType;
}

interface EntityPageProps extends PageProps {
	entity: Entity;
}

async function EntityPage({ entity, header, searchParams }: EntityPageProps) {
	// await new Promise((resolve) => setTimeout(resolve, 2000));

	switch (entity) {
		case "users":
			return <UsersPage header={header} searchParams={searchParams} />;
		case "products":
			return <ProductsPage header={header} searchParams={searchParams} />;
		case "orders":
			return <OrdersPage header={header} searchParams={searchParams} />;
		case "carts":
			return <CartsPage header={header} searchParams={searchParams} />;
		case "categories":
			return <CategoriesPage header={header} searchParams={searchParams} />;
		case "cart-items":
			return <CartItemsPage header={header} searchParams={searchParams} />;
		case "order-items":
			return <OrderItemsPage header={header} searchParams={searchParams} />;
	}
}

export type { PageProps };
