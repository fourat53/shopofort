"use client";

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import CreateForm from "@/components/forms/create-form";
import CurrentEntity from "@/components/title/CurrentEntity";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EntityType } from "@/lib/entity/types";
import { getSingleName } from "@/lib/functions/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CreateDialog() {
	const entity = CurrentEntity();
	const [open, setOpen] = useState<boolean>(false);

	if (!entity || entity === EntityType.users) return;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							aria-label="Create"
							className="size-7 sm:size-8 p-2"
							icon={<IconPlus className="size-4" />}
						/>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>Create new {getSingleName(entity)}</TooltipContent>
			</Tooltip>
			<CreateForm entity={entity} open={open} setOpen={setOpen} />
		</Dialog>
	);
}
