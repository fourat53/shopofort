"use client";

import { IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { deleteEntities, deleteEntity } from "@/actions/EntityActions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getPluralName, getSingleName } from "@/lib/entity/functions";
import type { EntityType, StringNumber } from "@/lib/entity/types";

interface DeleteDialogProps {
	entity?: EntityType;
	ids?: StringNumber[];
	disabled?: boolean;
}

export default function DeleteDialog({
	entity,
	ids,
	disabled,
}: DeleteDialogProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const DeleteDialogRef = useRef<HTMLButtonElement>(null);

	const single = ids?.length === 1;

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		if (!entity || !ids) return;
		setLoading(true);
		try {
			single
				? await deleteEntity(entity, ids[0])
				: await deleteEntities(entity, ids);
		} catch {
			toast.error(
				<>
					<p>
						Failed to delete{" "}
						{single ? getSingleName(entity) : getPluralName(entity)}.
					</p>
					<p className="text-sm text-muted-foreground">
						Check if the {single ? "id is" : "ids are"} used by other entities.
					</p>
				</>,
			);
		} finally {
			setOpen(false);
			setLoading(false);
		}
	};

	const display = ids && ids.length > 0 && entity;

	if (!display)
		return (
			<Button
				variant="ghost"
				disabled={disabled}
				className="size-6 p-0"
				icon={<IconTrash className="size-4 text-red-500" />}
			/>
		);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled}
					className="size-6 p-0"
					icon={<IconTrash className="size-4 text-red-500" />}
				/>
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
				</DialogHeader>
				<div>
					This action cannot be undone. This will permanently delete the{" "}
					{single ? (
						<span className="font-semibold text-foreground">
							{getSingleName(entity)} with Id {ids[0]}.
						</span>
					) : (
						<div>
							<span className="font-semibold text-foreground">
								{ids.length} selected {getPluralName(entity)}
							</span>{" "}
							and remove their data from our servers.
						</div>
					)}
				</div>
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
						Delete{!single && " All"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
