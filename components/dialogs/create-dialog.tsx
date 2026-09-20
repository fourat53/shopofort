"use client";

import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import { updateCache } from "@/actions/EntityActions";
import CreateForm from "@/components/forms/create-form";
import CurrentEntity from "@/components/title/CurrentEntity";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EntityType } from "@/lib/entity/types";

export default function CreateDialog() {
	const entity = CurrentEntity();
	const [open, setOpen] = useState<boolean>(false);

	if (!entity || entity === EntityType.users)
		return (
			<Button
				variant="outline"
				icon={<IconRefresh />}
				onClick={() => updateCache()}
			/>
		);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button
				variant="outline"
				icon={<IconRefresh />}
				onClick={() => updateCache()}
			/>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="size-8 p-2"
					icon={<IconPlus className="size-4" />}
				/>
			</DialogTrigger>
			<CreateForm entity={entity} open={open} setOpen={setOpen} />
		</Dialog>
	);
}
