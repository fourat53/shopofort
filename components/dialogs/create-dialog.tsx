"use client";

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import CreateEditForm from "@/components/forms/create-edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CurrentEntity } from "@/lib/entity/current-entity";

export default function CreateDialog() {
	const entity = CurrentEntity();
	const [open, setOpen] = useState<boolean>(false);

	if (!entity || entity === "user") return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<IconPlus className="size-4" />
				</Button>
			</DialogTrigger>
			<CreateEditForm entity={entity} setOpen={setOpen} />
		</Dialog>
	);
}
