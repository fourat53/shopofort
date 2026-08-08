"use client";

import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { deleteEntity } from "@/actions/EntityActions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CurrentEntity } from "./current-entity";

export default function DeleteButton({
	id,
	disabled,
}: {
	id: number | string;
	disabled?: boolean;
}) {
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!entity) return;
		setLoading(true);
		try {
			await deleteEntity(entity, id);
		} catch (error) {
			console.error("Failed to delete entity", error);
		} finally {
			setLoading(false);
			setOpen(false);
			entity === "user" && window.location.reload();
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled || loading || !entity}
					className="rounded-xl size-6 p-0 text-red-500 hover:text-red-700"
				>
					<IconTrash className="h-4 w-4" />
				</Button>
			</DialogTrigger>

			<DialogContent className="w-90">
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete this{" "}
						<span className="font-semibold text-foreground">{entity}</span> and
						remove its data from our servers.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						loading={loading}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
