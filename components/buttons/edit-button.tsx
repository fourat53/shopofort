"use client";

import { IconEdit } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFilterOptions, updateEntity } from "@/actions/EntityActions";
import { Input } from "@/components/form-items/input";
import { Select, type SelectOption } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CurrentEntity, entityFields } from "../../lib/entity/current-entity";
import { DatePicker } from "../form-items/date-picker";

interface EditButtonProps<T> {
	row: T;
	disabled?: boolean;
}

export default function EditButton<T extends { id: number | string }>({
	row,
	disabled,
}: EditButtonProps<T>) {
	const router = useRouter();
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
			await updateEntity(entity, row.id, formData);

			setOpen(false);
			entity === "user" && router.refresh();
		} catch (error) {
			console.error("Error updating entity:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!entity) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					disabled={disabled || loading || !entity}
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
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2">
					{currentFields.map((field) => {
						const value = (row as Record<string, unknown>)[field.name];

						return (
							<div key={field.name} className="flex flex-col gap-2">
								{field.type === "string" && (
									<Input
										name={field.name}
										label={field.label.toString()}
										defaultValue={value?.toString() ?? ""}
										required={field.required}
									/>
								)}

								{field.type === "number" && (
									<Input
										name={field.name}
										label={field.label.toString()}
										type="number"
										step={field.step ?? "1"}
										defaultValue={
											value !== null && value !== undefined ? String(value) : ""
										}
										required={field.required}
									/>
								)}

								{field.type === "date" && (
									<DatePicker
										name={field.name}
										label={field.label.toString()}
										defaultValue={value as string | Date | undefined}
										required={field.required}
									/>
								)}

								{field.type === "enum" && (
									<Select
										name={field.name}
										label={field.label}
										defaultValue={value?.toString() || undefined}
										placeholder="Select an option"
										items={
											field.enumValues?.map((enumValue) => ({
												label: enumValue,
												value: enumValue,
											})) ?? []
										}
										required={field.required}
									/>
								)}

								{field.type === "foreignKey" && (
									<Select
										name={field.name}
										label={field.label}
										placeholder="Select an option"
										defaultValue={
											value !== null && value !== undefined ? String(value) : ""
										}
										items={optionsCache[field.name] ?? []}
										required={field.required}
									/>
								)}
							</div>
						);
					})}

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
							Update
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
