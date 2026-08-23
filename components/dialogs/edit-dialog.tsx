"use client";

import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import CreateEditForm from "@/components/forms/create-edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CurrentEntity } from "@/lib/entity/current-entity";

interface EditDialogProps<T> {
	rows?: T[];
	disabled?: boolean;
}

export default function EditDialog<
	T extends Record<string, unknown> & { id: number | string },
>({ rows, disabled }: EditDialogProps<T>) {
	const entity = CurrentEntity();
	const [open, setOpen] = useState<boolean>(false);

	const display = rows && rows.length > 0;

	if (!entity) return null;

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
