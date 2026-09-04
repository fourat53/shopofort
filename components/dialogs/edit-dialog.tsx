"use client";

import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import CreateEditForm from "@/components/forms/edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { EntityType, RowType } from "@/lib/entity/types";

interface EditDialogProps<T> {
	entity?: EntityType;
	rows?: T[];
	disabled?: boolean;
}

export default function EditDialog<T extends RowType>({
	entity,
	rows,
	disabled,
}: EditDialogProps<T>) {
	const [open, setOpen] = useState<boolean>(false);

	const display = rows && rows.length > 0 && entity;

	if (!display)
		return (
			<Button
				variant="ghost"
				disabled={disabled}
				className="size-6 p-1"
				icon={<IconEdit className="size-4 text-mist-400" />}
			/>
		);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled}
					className="size-6 p-1"
					icon={<IconEdit className="size-4 text-mist-400" />}
				/>
			</DialogTrigger>
			<CreateEditForm<T>
				entity={entity}
				open={open}
				setOpen={setOpen}
				rows={rows}
			/>
		</Dialog>
	);
}
