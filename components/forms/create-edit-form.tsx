"use client";

import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	createEntity,
	getFilterOptions,
	updateEntities,
	updateEntity,
} from "@/actions/EntityActions";
import { DatePicker } from "@/components/form-items/date-picker";
import {
	type ImageItem,
	ImageUpload,
} from "@/components/form-items/image-upload";
import { Input } from "@/components/form-items/input";
import { Select, type SelectOption } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	type EntityType,
	getFieldName,
	getPluralName,
	getSingleName,
} from "@/lib/entity/current-entity";
import {
	type FieldConfig,
	getEntityFields,
	type ValueType,
} from "@/lib/entity/entity-fields";
import { addImagesToForm } from "@/lib/uploadthing/client";

interface DialogFormProps<T> {
	entity: EntityType;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	rows?: T[];
}

export default function CreateEditForm<
	T extends Record<string, unknown> & { id: number | string },
>({ entity, open, setOpen, rows }: DialogFormProps<T>) {
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<ImageItem[]>([]);
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});

	const fetchedFields = useRef<Set<string>>(new Set());

	const ids = useMemo(() => rows?.map((row) => row.id), [rows]);
	const fields = useMemo(
		() => getEntityFields(entity, rows ? "edit" : "create"),
		[entity, rows],
	);

	const single = rows?.length === 1;
	const label = rows
		? single
			? "Update " + getSingleName(entity)
			: "Update the " + rows?.length + " selected " + getPluralName(entity)
		: "Create " + getSingleName(entity);

	useEffect(() => {
		if (!open || entity !== "product") return;
		else if (rows) {
			setImages(Array.isArray(rows[0]?.images) ? rows[0].images : []);
			return;
		} else setImages([]);
	}, [open, entity, rows]);

	useEffect(() => {
		if (!open) return;
		async function loadOptions() {
			for (const field of fields) {
				if (
					field.type !== "foreignKey" ||
					fetchedFields.current.has(field.name)
				)
					continue;
				fetchedFields.current.add(field.name);
				try {
					const options = await getFilterOptions(field.name);
					setOptionsCache((current) => ({
						...current,
						[field.name]: options,
					}));
				} catch (error) {
					fetchedFields.current.delete(field.name);
					console.error(error);
				}
			}
		}
		loadOptions();
	}, [open, fields]);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		setLoading(true);
		try {
			await addImagesToForm(formData, images);
			if (ids) {
				single
					? await updateEntity(entity, ids[0], formData)
					: await updateEntities(entity, ids, formData);
			} else if (entity !== "user") await createEntity(entity, formData);
		} catch (error) {
			console.error("Error creating entity:", error);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}

	function getValue(field: FieldConfig) {
		return rows ? (rows[0]?.[field.name] as ValueType) : field.defaultValue;
	}

	if (!open) return null;

	return (
		<DialogContent
			onPointerDownOutside={(e) => loading && e.preventDefault()}
			onEscapeKeyDown={(e) => loading && e.preventDefault()}
			className="w-180 max-w-180"
		>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
				</DialogHeader>
				{fields.map((field) => {
					const value = getValue(field);
					return field.type === "string" ? (
						<Input
							key={field.name}
							name={field.name}
							label={getFieldName(field.name)}
							defaultValue={value?.toString() || undefined}
							required={field.required}
						/>
					) : field.type === "number" ? (
						<Input
							key={field.name}
							name={field.name}
							label={getFieldName(field.name)}
							type="number"
							step={field.step ?? "1"}
							defaultValue={value?.toString() || undefined}
							required={field.required}
						/>
					) : field.type === "date" ? (
						<DatePicker
							key={field.name}
							name={field.name}
							label={getFieldName(field.name)}
							defaultValue={value as string | Date | undefined}
							required={field.required}
						/>
					) : field.type === "image" ? (
						<ImageUpload
							key={field.name}
							name={field.name}
							label={getFieldName(field.name)}
							images={images}
							onChange={setImages}
							required={field.required}
						/>
					) : field.type === "enum" ? (
						<Select
							key={field.name}
							name={field.name}
							label={getFieldName(field.name)}
							placeholder={"Select an option"}
							defaultValue={value?.toString() || "NONE"}
							required={field.required}
							items={[
								{ label: "None", value: "NONE" },
								...(field.options?.map((o) => ({ label: o, value: o })) ?? []),
							]}
						/>
					) : field.type === "foreignKey" ? (
						<Select
							key={field.name}
							name={field.name}
							label={getFieldName(field.name)}
							placeholder={"Select an option"}
							required={field.required}
							defaultValue={value?.toString() || "NONE"}
							items={[
								{ label: "None", value: "NONE" },
								...(optionsCache[field.name] ?? []),
							]}
						/>
					) : null;
				})}
				<DialogFooter className="pt-2">
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button type="submit" loading={loading}>
						{rows ? "Update" : "Create"}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
