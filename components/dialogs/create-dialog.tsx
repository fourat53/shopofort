"use client";

import { IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createEntity, getFilterOptions } from "@/actions/EntityActions";
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

export default function CreateDialog() {
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});

	const fetchedFields = useRef<Set<string>>(new Set());

	const currentFields = useMemo(
		() =>
			entity
				? (entityFields[entity]?.filter((field) =>
						field.category.includes("create"),
					) ?? [])
				: [],
		[entity],
	);

	useEffect(() => {
		if (!open || !entity || entity === "user") return;

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
			await createEntity(entity, formData);
		} catch (error) {
			console.error("Error creating entity:", error);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	if (!entity || entity === "user") return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<IconPlus className="h-4 w-4" />
				</Button>
			</DialogTrigger>

			<DialogContent
				onPointerDownOutside={(e) => loading && e.preventDefault()}
				onEscapeKeyDown={(e) => loading && e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>
						Create New {entity.charAt(0).toUpperCase() + entity.slice(1)}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<DialogForm
						fields={currentFields}
						optionsCache={optionsCache}
						getValue={(field) => field.defaultValue}
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
							Create
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
