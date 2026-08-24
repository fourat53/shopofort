"use client";

import { IconList } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CurrentEntity } from "@/lib/entity/current-entity";

interface EditDialogProps {
	id?: number | string;
	disabled?: boolean;
}

export default function ListDialog({ id, disabled }: EditDialogProps) {
	const entity = CurrentEntity();
	const [open, setOpen] = useState<boolean>(false);

	if (!entity) return null;

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
