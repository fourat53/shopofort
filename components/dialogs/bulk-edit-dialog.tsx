"use client";

import { IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFilterOptions, updateEntities } from "@/actions/EntityActions";
import type { SelectOption } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CurrentEntity, entityFields } from "@/lib/entity/current-entity";
import DialogForm from "./dialog-form";

interface BulkEditDialogProps<T> {
	rows: T[];
}

export default function BulkEditDialog<T extends { id: number | string }>({
	rows,
}: BulkEditDialogProps<T>) {
	const router = useRouter();
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});

	const fetchedFields = useRef<Set<string>>(new Set());

	const ids = useMemo(() => rows.map((row) => row.id), [rows]);

	const currentFields = useMemo(
		() =>
			entity
				? (entityFields[entity]?.filter((field) =>
						field.category.includes("edit"),
					) ?? [])
				: [],
		[entity],
	);

	useEffect(() => {
		if (!open || !entity) return;

		for (const field of currentFields) {
			if (
				field.type !== "foreignKey" ||
				fetchedFields.current.has(field.name)
			) {
				continue;
			}

			fetchedFields.current.add(field.name);

			getFilterOptions(field.name)
				.then((options) => {
					setOptionsCache((current) => ({
						...current,
						[field.name]: options,
					}));
				})
				.catch((error) => {
					fetchedFields.current.delete(field.name);
					console.error(error);
				});
		}
	}, [open, entity, currentFields]);

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			const formData = new FormData(e.currentTarget);
			await updateEntities(entity, ids, formData);

			setOpen(false);
			entity === "user" && router.refresh();
		} catch (error) {
			console.error("Error updating entities:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!entity || ids.length === 0) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={loading || !entity}
					border={false}
					className="rounded-xl size-6 p-0"
				>
					<IconEdit className="h-4 w-4 text-mist-400" />
				</Button>
			</DialogTrigger>

			<DialogContent
				onPointerDownOutside={(e) => loading && e.preventDefault()}
				onEscapeKeyDown={(e) => loading && e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>
						Edit {entity.charAt(0).toUpperCase() + entity.slice(1)}
						{ids.length > 1 ? `s (${ids.length} selected)` : ""}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<DialogForm
						fields={currentFields}
						optionsCache={optionsCache}
						getValue={(field) =>
							(rows[0] as Record<string, unknown>)[field.name] as
								| string
								| number
								| Date
								| undefined
						}
					/>

					<DialogFooter className="pt-4">
						<Button
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={loading}
							type="button"
						>
							Cancel
						</Button>

						<Button loading={loading} type="submit">
							Update All
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
