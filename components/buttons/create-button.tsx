"use client";

import { IconPlus } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { createEntity, getFilterOptions } from "@/actions/EntityActions";
import { ImageUpload } from "@/components/form-items/image-upload";
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
import { DatePicker } from "../form-items/date-picker";
import { CurrentEntity, entityFields } from "./current-entity";

export default function CreateButton() {
	const entity = CurrentEntity();

	const [open, setOpen] = useState<boolean>(false);
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});
	const [productImages, setProductImages] = useState<File[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const fetchedFields = useRef<Set<string>>(new Set());

	const currentFields = entity
		? (entityFields[entity]?.filter((field) =>
				field.category.includes("create"),
			) ?? [])
		: [];

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

		try {
			setLoading(true);

			const formData = new FormData(e.currentTarget);

			for (const image of productImages) {
				formData.append("images", image);
			}

			await createEntity(entity, formData);

			setOpen(false);
			setProductImages([]);
		} catch (error) {
			console.error("Error creating entity:", error);
		} finally {
			setLoading(false);
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

				<form onSubmit={handleSubmit} className="flex flex-col gap-2 pt-2">
					{currentFields.map((field) => (
						<div key={field.name} className="flex flex-col gap-2">
							{field.type === "string" && (
								<Input
									name={field.name}
									label={field.label.toString()}
									type="text"
									defaultValue={field.defaultValue ?? ""}
									required={field.required}
								/>
							)}

							{field.type === "number" && (
								<Input
									name={field.name}
									label={field.label.toString()}
									type="number"
									step={field.step ?? "1"}
									defaultValue={field.defaultValue ?? ""}
									required={field.required}
								/>
							)}

							{field.type === "date" && (
								<DatePicker
									name={field.name}
									label={field.label.toString()}
									defaultValue={new Date()}
									required={field.required}
								/>
							)}

							{field.type === "enum" && (
								<Select
									name={field.name}
									label={field.label}
									defaultValue={field.defaultValue?.toString() || undefined}
									placeholder="Select an option"
									items={
										field.enumValues?.map((value) => ({
											label: value,
											value,
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
									items={optionsCache[field.name] ?? []}
									required={field.required}
								/>
							)}

							{field.type === "image" && (
								<ImageUpload
									images={productImages}
									onChange={setProductImages}
								/>
							)}
						</div>
					))}

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
