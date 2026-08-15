"use client";

import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { deleteEntities } from "@/actions/EntityActions";
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
import { CurrentEntity } from "@/lib/entity/current-entity";

export default function BulkDeleteDialog({
	ids,
}: {
	ids: (number | string)[];
}) {
	const router = useRouter();
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const DeleteDialogRef = useRef<HTMLButtonElement>(null);

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await deleteEntities(entity, ids);

			setOpen(false);
			entity === "user" && router.refresh();
		} catch (error) {
			console.error("Failed to delete entities", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={loading || !entity || ids.length === 0}
					className="rounded-xl size-6 p-0 text-red-500 hover:text-red-700"
				>
					<IconTrash className="h-4 w-4" />
				</Button>
			</DialogTrigger>

			<DialogContent
				className="w-90"
				onOpenAutoFocus={(e) => {
					e.preventDefault();
					DeleteDialogRef.current?.focus();
				}}
			>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete the{" "}
						{ids.length} selected{" "}
						<span className="font-semibold text-foreground">
							{entity}
							{ids.length > 1 ? "s" : ""}
						</span>{" "}
						and remove their data from our servers.
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
						ref={DeleteDialogRef}
						variant="destructive"
						onClick={handleDelete}
						loading={loading}
					>
						Delete All
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
