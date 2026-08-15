"use client";

import BulkDeleteDialog from "@/components/dialogs/bulk-delete-dialog";
import BulkEditDialog from "@/components/dialogs/bulk-edit-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelection } from "@/hooks/use-selection";

type CheckboxType = "select-all" | "select-one" | "actions";

interface CheckBoxCellProps<T extends { id: number | string }> {
	rows: T[];
	row?: T;
	type: CheckboxType;
}

export default function CheckBoxCell<T extends { id: number | string }>({
	rows,
	row,
	type,
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
				<BulkEditDialog rows={selectedRows} />
				<BulkDeleteDialog ids={[...selectedIds]} />
			</div>
		) : (
			"Actions"
		);
	}

	if (type === "select-one" && row) {
		return (
			<Checkbox
				checked={selectedIds.has(row.id)}
				onCheckedChange={(checked) => toggleRow(row.id, checked === true)}
			/>
		);
	}
}
