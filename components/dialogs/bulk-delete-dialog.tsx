"use client";

import { IconTrash } from "@tabler/icons-react";
import { clsx } from "clsx";
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
import { getPluralFromName } from "@/lib/entity/entity-header";

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
				className="w-100"
				onPointerDownOutside={(e) => loading && e.preventDefault()}
				onEscapeKeyDown={(e) => loading && e.preventDefault()}
				onOpenAutoFocus={(e) => {
					e.preventDefault();
					DeleteDialogRef.current?.focus();
				}}
			>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription className="pt-2">
						This action cannot be undone. This will permanently delete the{" "}
						<span className="font-semibold text-foreground">
							{ids.length} selected {getPluralFromName(entity)}
						</span>{" "}
						and remove their data from our servers. This is the list of their
						IDs:
					</DialogDescription>
					<div
						className={clsx(
							"grid gap-1",
							entity === "user" ? "grid-cols-2" : "grid-cols-5",
						)}
					>
						{ids.map((id) => (
							<p
								key={id}
								className="font-medium truncate"
								title={id.toString()}
							>
								{id}
							</p>
						))}
					</div>
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
