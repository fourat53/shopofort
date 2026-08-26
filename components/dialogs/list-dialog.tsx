"use client";

import { IconList } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { EntityType, StringNumber } from "@/lib/entity/types";

interface EditDialogProps {
	entity?: EntityType;
	id?: StringNumber;
	disabled?: boolean;
}

export default function ListDialog({ id, disabled }: EditDialogProps) {
	const [open, setOpen] = useState<boolean>(false);
	if (!id)
		return (
			<Button
				variant="ghost"
				disabled={disabled}
				className="size-6 p-1"
				icon={<IconList className="size-4 text-mist-400" />}
			/>
		);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled}
					className="size-6 p-1"
					icon={<IconList className="size-4 text-mist-400" />}
				/>
			</DialogTrigger>
			<DialogContent></DialogContent>
		</Dialog>
	);
}
