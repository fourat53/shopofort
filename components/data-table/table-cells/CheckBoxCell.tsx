"use client";

import DeleteDialog from "@/components/dialogs/delete-dialog";
import EditDialog from "@/components/dialogs/edit-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelection } from "@/hooks/use-selection";
import type { EntityType, RowType, StringNumber } from "@/lib/entity/types";

type CheckboxType = "select-all" | "select-one" | "actions";

interface CheckBoxCellProps<T> {
	entity: EntityType;
	rows: T[];
	type: CheckboxType;
	id?: StringNumber;
}

export default function CheckBoxCell<T extends RowType>({
	entity,
	rows,
	type,
	id,
}: CheckBoxCellProps<T>) {
	const {
		selectedIds,
		selectedRows,
		someSelected,
		allSelected,
		toggleAll,
		toggleRow,
	} = useSelection(rows);

	if (type === "select-all") {
		return (
			<Checkbox
				checked={allSelected || (someSelected ? "indeterminate" : false)}
				onCheckedChange={(checked) => toggleAll(checked === true)}
			/>
		);
	}

	if (type === "actions") {
		return someSelected ? (
			<div className="flex items-center justify-center gap-1.5">
				<EditDialog entity={entity} rows={selectedRows} />
				<DeleteDialog entity={entity} ids={[...selectedIds]} />
			</div>
		) : (
			"Actions"
		);
	}

	if (type === "select-one" && id) {
		return (
			<Checkbox
				checked={selectedIds.has(id)}
				onCheckedChange={(checked) => toggleRow(id, checked === true)}
			/>
		);
	}
}
