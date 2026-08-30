import { IconList } from "@tabler/icons-react";
import { Suspense } from "react";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import CartItemsTable from "@/components/entity-tables/CartItemsTable";
import OrderItemsTable from "@/components/entity-tables/OrderItemsTable";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getSingleName } from "@/lib/entity/entity-functions";
import {
	CART_ITEMS_HEADER,
	type HeaderItem,
	ORDER_ITEMS_HEADER,
} from "@/lib/entity/entity-header";
import { EntityType } from "@/lib/entity/types";

interface ListDialogProps {
	entity: EntityType;
	id?: number;
	disabled?: boolean;
}

export default async function ListDialog({
	id,
	entity,
	disabled,
}: ListDialogProps) {
	if (![EntityType.carts, EntityType.orders].includes(entity)) return null;

	if (!id || disabled) {
		return (
			<Button
				variant="ghost"
				disabled={disabled}
				className="size-6 p-1"
				icon={<IconList className="size-4 text-mist-400" />}
			/>
		);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled}
					className="size-6 p-1"
					icon={<IconList className="size-4 text-mist-400" />}
				/>
			</DialogTrigger>

			<DialogContent
				showCloseButton
				className="min-h-[90vh] min-w-[90vw] flex flex-col gap-4"
			>
				<DialogHeader>
					<DialogTitle className="py-0 capitalize">
						{getSingleName(entity)} items
					</DialogTitle>
				</DialogHeader>
				<EntityItemsLayout id={id} entity={entity} />
			</DialogContent>
		</Dialog>
	);
}

async function EntityItemsLayout({
	id,
	entity,
}: {
	id: number;
	entity: EntityType;
}) {
	const isCart = entity === EntityType.carts;
	let header: HeaderItem[];
	let filterParams: Record<string, string | string[] | undefined>;
	if (isCart) {
		header = CART_ITEMS_HEADER;
		filterParams = { cartId: String(id) };
	} else {
		header = ORDER_ITEMS_HEADER;
		filterParams = { orderId: String(id) };
	}
	return (
		<Suspense
			key={JSON.stringify({ entity, id })}
			fallback={<DataTableSkeleton entity={entity} header={header} />}
		>
			{isCart ? (
				<CartItemsTable
					entity={entity}
					header={header}
					pageSize={10000}
					sortable={false}
					filterParams={filterParams}
				/>
			) : (
				<OrderItemsTable
					entity={entity}
					header={header}
					pageSize={10000}
					sortable={false}
					filterParams={filterParams}
				/>
			)}
		</Suspense>
	);
}
