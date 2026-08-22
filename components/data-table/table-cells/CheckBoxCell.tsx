"use client";

import DeleteDialog from "@/components/dialogs/delete-dialog";
import EditDialog from "@/components/dialogs/edit-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelection } from "@/hooks/use-selection";

type CheckboxType = "select-all" | "select-one" | "actions";

interface CheckBoxCellProps<T extends { id: number | string }> {
	rows: T[];
	type: CheckboxType;
	id?: number | string;
}

export default function CheckBoxCell<T extends { id: number | string }>({
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
				<EditDialog rows={selectedRows} />
				<DeleteDialog ids={[...selectedIds]} />
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
