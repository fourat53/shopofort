"use client";

import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import {
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
import { getEntityFields } from "@/lib/entity/entity-fields";
import {
	getFieldName,
	getPluralName,
	getSingleName,
} from "@/lib/entity/entity-functions";
import type { EntityType, OptionField, StringNumber } from "@/lib/entity/types";
import { getError } from "@/lib/mutation";
import { addImagesToForm } from "@/lib/uploadthing/client";

interface DialogFormProps<T> {
	entity: EntityType;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	rows: T[];
}

export default function CreateEditForm<
	T extends Record<string, unknown> & { id: StringNumber },
>({ entity, open, setOpen, rows }: DialogFormProps<T>) {
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<ImageItem[]>([]);
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});

	const fetchedFields = useRef<Set<string>>(new Set());
	const ids = useMemo(() => rows.map((row) => row.id), [rows]);
	const fields = useMemo(() => getEntityFields(entity, "edit"), [entity]);

	const single = rows.length === 1;
	const label = single
		? "Update " + getSingleName(entity)
		: "Update the " + rows.length + " selected " + getPluralName(entity);

	useEffect(() => {
		if (!open || entity !== "products") return;
		setImages(Array.isArray(rows[0].images) ? rows[0].images : []);
		return;
	}, [open, entity, rows]);

	useEffect(() => {
		if (!open) return;
		async function loadOptions() {
			for (const field of fields) {
				const name = field.name;
				if (field.type !== "foreignKey" || fetchedFields.current.has(name))
					continue;
				fetchedFields.current.add(name);
				try {
					const options = await getFilterOptions(name as OptionField);
					setOptionsCache((current) => ({
						...current,
						[name]: options,
					}));
				} catch (e) {
					toast.error(`Error fetching ${name}s: ${getError(e)}`);
					fetchedFields.current.delete(name);
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
			single
				? await updateEntity(entity, ids[0], formData)
				: await updateEntities(entity, ids, formData);
		} catch (e) {
			toast.error(
				`Error updating ${single ? getSingleName(entity) : getPluralName(entity)}: ${getError(e)}`,
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
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
					const value = rows[0][field.name];
					const { type, name, required } = field;
					const label = getFieldName(name);
					return type === "string" ? (
						<Input
							key={name}
							name={name}
							label={label}
							placeholder={`Enter ${label.toLowerCase()}`}
							defaultValue={value?.toString() || undefined}
							required={required}
						/>
					) : type === "number" ? (
						<Input
							key={name}
							name={name}
							label={label}
							type="number"
							step={field.step ?? "1"}
							placeholder={`Enter ${label.toLowerCase()}`}
							defaultValue={value?.toString() || undefined}
							required={required}
						/>
					) : type === "date" ? (
						<DatePicker
							key={name}
							name={name}
							label={label}
							defaultValue={value as string | Date | undefined}
							required={required}
							time
						/>
					) : type === "image" ? (
						<ImageUpload
							key={name}
							name={name}
							label={label}
							images={images}
							onChange={setImages}
							required={required}
						/>
					) : type === "enum" ? (
						<Select
							key={name}
							name={name}
							label={label}
							defaultValue={value?.toString() || "NONE"}
							required={required}
							items={[
								{ label: "None", value: "NONE" },
								...(field.options?.map((o) => ({ label: o, value: o })) ?? []),
							]}
						/>
					) : type === "foreignKey" ? (
						<Select
							key={name}
							name={name}
							label={label}
							required={required}
							defaultValue={value?.toString() || "NONE"}
							items={[
								{ label: "None", value: "NONE" },
								...(optionsCache[name] ?? []),
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
						Update
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
