import { IconList } from "@tabler/icons-react";
import { Suspense } from "react";
import { getCartItemsByCartId } from "@/actions/CartItemActions";
import { getOrderItemsByOrderId } from "@/actions/OrderItemActions";
import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
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
	ORDER_ITEMS_HEADER,
} from "@/lib/entity/entity-header";
import { type CartItem, EntityType, type OrderItem } from "@/lib/entity/types";
import DataTable from "../data-table/DataTable";

interface ListDialogProps {
	entity: EntityType;
	id?: number;
	disabled?: boolean;
	dialog?: boolean;
}

export default async function ListDialog({
	id,
	entity,
	disabled,
	dialog,
}: ListDialogProps) {
	const isCart = entity === EntityType.carts;

	if (dialog || ![EntityType.carts, EntityType.orders].includes(entity))
		return null;

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

				<Suspense
					fallback={
						<DataTableSkeleton
							entity={entity}
							header={isCart ? CART_ITEMS_HEADER : ORDER_ITEMS_HEADER}
						/>
					}
				>
					{isCart ? <CartItemsTable id={id} /> : <OrderItemsTable id={id} />}
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}

async function CartItemsTable({ id }: { id: number }) {
	const rows: CartItem[] = await getCartItemsByCartId(id);
	return (
		<DataTable<CartItem>
			entity={EntityType["cart-items"]}
			header={CART_ITEMS_HEADER}
			sortable={false}
			rows={rows}
			dialog
		/>
	);
}

async function OrderItemsTable({ id }: { id: number }) {
	const rows: OrderItem[] = await getOrderItemsByOrderId(id);
	return (
		<DataTable<OrderItem>
			entity={EntityType["order-items"]}
			header={ORDER_ITEMS_HEADER}
			sortable={false}
			rows={rows}
			dialog
		/>
	);
}
