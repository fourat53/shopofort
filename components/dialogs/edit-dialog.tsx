"use client";

import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import CreateEditForm from "@/components/forms/create-edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CurrentEntity } from "@/lib/entity/current-entity";

export default function EditDialog<
	T extends Record<string, unknown> & { id: number | string },
>({ rows }: { rows?: T[] }) {
	const entity = CurrentEntity();
	const [open, setOpen] = useState<boolean>(false);

	if (!entity || !rows || rows.length === 0) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={!entity}
					className="rounded-xl size-6 p-0"
					border={false}
				>
					<IconEdit className="size-4 text-mist-400" />
				</Button>
			</DialogTrigger>
			<CreateEditForm entity={entity} setOpen={setOpen} rows={rows} />
		</Dialog>
	);
}
