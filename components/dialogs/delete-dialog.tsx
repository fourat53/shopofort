"use client";

import { IconTrash } from "@tabler/icons-react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { deleteEntities, deleteEntity } from "@/actions/EntityActions";
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
import { getPluralName, getSingleName } from "@/lib/entity/entity-header";
import EntityTooltip from "../data-table/table-cells/EntityTooltip";

export default function DeleteDialog({ ids }: { ids?: (number | string)[] }) {
	const router = useRouter();
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const DeleteDialogRef = useRef<HTMLButtonElement>(null);

	const single = ids?.length === 1;

	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			single
				? await deleteEntity(entity, ids[0])
				: await deleteEntities(entity, ids as (number | string)[]);
			setOpen(false);
			entity === "user" && router.refresh();
		} catch (error) {
			console.error("Failed to delete entities", error);
		} finally {
			setLoading(false);
		}
	};

	if (!entity || !ids || ids.length === 0) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={loading || !entity || ids.length === 0}
					className="rounded-xl size-6 p-0 text-red-500 hover:text-red-700"
				>
					<IconTrash className="size-4" />
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
				</DialogHeader>
				<DialogDescription>
					This action cannot be undone. This will permanently delete the{" "}
					{single ? (
						<span className="font-semibold text-foreground">
							{getSingleName(entity)} with Id {ids[0]}.
						</span>
					) : (
						<>
							<span className="font-semibold text-foreground">
								{ids.length} selected {getPluralName(entity)}
							</span>{" "}
							and remove their data from our servers. This is the list of their
							Ids:
							<div
								className={clsx(
									"py-3 grid gap-1",
									entity === "user" ? "grid-cols-2" : "grid-cols-5",
								)}
							>
								{ids.map((id) => (
									<EntityTooltip
										key={id}
										idValue={id}
										headerName={entity + "Id"}
									/>
								))}
							</div>
						</>
					)}
				</DialogDescription>
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
