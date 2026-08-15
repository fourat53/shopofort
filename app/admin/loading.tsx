"use client";

import type { HasImage } from "@/components/data-table/DataTable";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import GlobalLoader from "@/components/loaders/global-loader/global-loader";
import { CurrentEntity } from "@/lib/entity/current-entity";
import {
	CART_ITEMS_HEADER,
	CARTS_HEADER,
	CATEGORIES_HEADER,
	type HeaderType,
	ORDER_ITEMS_HEADER,
	ORDERS_HEADER,
	PRODUCTS_HEADER,
	USERS_HEADER,
} from "@/lib/entity/entity-headers";

export default function Loading() {
	const entity = CurrentEntity();

	if (!entity) return <GlobalLoader />;

	let header: HeaderType = [];

	if (entity === "cart") header = CARTS_HEADER;
	if (entity === "cartItem") header = CART_ITEMS_HEADER;
	if (entity === "category") header = CATEGORIES_HEADER;
	if (entity === "order") header = ORDERS_HEADER;
	if (entity === "orderItem") header = ORDER_ITEMS_HEADER;
	if (entity === "product") header = PRODUCTS_HEADER;
	if (entity === "user") header = USERS_HEADER;

	let hasImage: HasImage = "none";

	if (entity === "product") hasImage = "multiple";
	else if (entity === "user") hasImage = "one";

	if (header.length > 0)
		return <DataTableSkeleton header={header} hasImage={hasImage} />;
	else return <GlobalLoader />;
}
