"use client";

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import CreateEditForm from "@/components/forms/create-edit-form";
import CurrentEntity from "@/components/title/CurrentEntity";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EntityType } from "@/lib/entity/types";

export default function CreateDialog() {
	const entity = CurrentEntity();
	const [open, setOpen] = useState<boolean>(false);

	if (!entity || entity === EntityType.users) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="size-8 p-2"
					icon={<IconPlus className="size-4" />}
				/>
			</DialogTrigger>
			<CreateEditForm entity={entity} open={open} setOpen={setOpen} />
		</Dialog>
	);
}
