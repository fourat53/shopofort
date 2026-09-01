import { IconList } from "@tabler/icons-react";
import { Suspense } from "react";
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
	type HeaderItem,
	ORDER_ITEMS_HEADER,
} from "@/lib/entity/entity-header";
import { EntityType, OptionField } from "@/lib/entity/types";
import EntityTable from "@/components/entity-tables/EntityTable";

interface ListDialogProps {
	entity: EntityType;
	id?: number;
	dialog?: boolean;
	disabled?: boolean;
}

export default async function ListDialog({
	id,
	entity,
	dialog,
	disabled,
}: ListDialogProps) {
	if (dialog) return null;

	let header: HeaderItem[];
	let idField: OptionField;
	let tableEntity: EntityType;

	switch (entity) {
		case EntityType.carts:
			header = CART_ITEMS_HEADER;
			idField = OptionField.cartId;
			tableEntity = EntityType["cart-items"];
			break;
		case EntityType.products:
			header = CART_ITEMS_HEADER;
			idField = OptionField.productId;
			tableEntity = EntityType["cart-items"];
			break;
		case EntityType.orders:
			header = ORDER_ITEMS_HEADER;
			idField = OptionField.orderId;
			tableEntity = EntityType["order-items"];
			break;
		default:
			return null;
	}

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
				className="min-h-57 max-h-[85vh] min-w-[85vw] flex flex-col gap-4"
			>
				<DialogHeader>
					<DialogTitle className="py-0 capitalize">
						{getSingleName(tableEntity)}
					</DialogTitle>
				</DialogHeader>
				<Suspense
					fallback={<DataTableSkeleton entity={tableEntity} header={header} />}
				>
					<EntityTable
						dialog
						entity={tableEntity}
						header={header}
						pageSize={10000}
						filterParams={{ [idField]: String(id) }}
					/>
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}
