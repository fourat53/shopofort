"use client";

import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import EditForm from "@/components/forms/edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { EntityRow, EntityType } from "@/lib/entity/types";
import { getPluralName, getSingleName } from "@/lib/functions/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface EditDialogProps<T extends EntityType> {
	entity?: T;
	rows?: EntityRow<T>[];
	disabled?: boolean;
}

export default function EditDialog<T extends EntityType>({
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
				aria-label="Update"
				disabled={disabled}
				className="size-6 p-1"
				icon={<IconEdit className="size-4 text-mist-700 dark:text-mist-300" />}
			/>
		);

	const single = rows?.length === 1;
	const title = single
		? getSingleName(entity)
		: "the " + rows?.length + " selected " + getPluralName(entity);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							aria-label="Update"
							disabled={disabled}
							className="size-6 p-1"
							icon={
								<IconEdit className="size-4 text-mist-700 dark:text-mist-300" />
							}
						/>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>Update {title}</TooltipContent>
			</Tooltip>

			<EditForm<T>
				entity={entity}
				open={open}
				setOpen={setOpen}
				rows={rows}
				single={single}
				title={title}
			/>
		</Dialog>
	);
}
