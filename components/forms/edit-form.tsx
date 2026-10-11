"use client";

import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { updateEntities, updateEntity } from "@/actions/EntityActions";
import { DatePicker } from "@/components/form-items/date-picker";
import {
	type ImageItem,
	ImageUpload,
} from "@/components/form-items/image-upload";
import { Input } from "@/components/form-items/input";
import { Select } from "@/components/form-items/select";
import { TextArea } from "@/components/form-items/textarea";
import ForeignKeySelect from "@/components/forms/ForeignKeySelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogSubContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { type FieldConfig, getEntityFields } from "@/lib/entity/fields";
import type { EntityRow, EntityType } from "@/lib/entity/types";
import {
	getFieldName,
	getFieldValue,
	getPluralName,
	getSingleName,
} from "@/lib/functions/client";
import { addImages, uploadConfig } from "@/lib/uploadthing/client";

interface DialogFormProps<T extends EntityType> {
	entity: T;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	rows: EntityRow<T>[];
}

export default function EditForm<T extends EntityType>({
	entity,
	open,
	setOpen,
	rows,
}: DialogFormProps<T>) {
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<ImageItem[]>([]);
	const [enabledFields, setEnabledFields] = useState<Set<string>>(new Set());

	const ids = useMemo(() => rows.map((row) => row.id), [rows]);
	const fields = useMemo(() => getEntityFields(entity, "edit"), [entity]);

	const single = rows.length === 1;
	const entityName = single
		? getSingleName(entity)
		: "all the " + rows.length + " selected " + getPluralName(entity);

	const imageFieldName = useMemo(() => uploadConfig[entity]?.field, [entity]);

	const { field, multiple } = uploadConfig[entity] ?? {};

	useEffect(() => {
		if (!open || !field || rows.length === 0) {
			setImages([]);
			return;
		}

		const value = getFieldValue(rows[0], field);
		if (multiple) {
			setImages(Array.isArray(value) ? (value as string[]) : []);
		} else {
			setImages(value ? [value as string] : []);
		}

		if (single) {
			const allFields = new Set(fields.map((f) => f.name));
			setEnabledFields(allFields);
		} else {
			setEnabledFields(new Set());
		}
	}, [open, rows, fields, single, field, multiple]);

	function toggleField(name: string) {
		setEnabledFields((prev) => {
			const next = new Set(prev);
			if (next.has(name)) next.delete(name);
			else next.add(name);
			return next;
		});
	}

	function isFieldEnabled(name: string) {
		return single || enabledFields.has(name);
	}

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		setLoading(true);
		try {
			const imageFieldEnabled =
				single || (imageFieldName && enabledFields.has(imageFieldName));

			if (imageFieldEnabled) await addImages(entity, formData, images);

			if (single) {
				await updateEntity(entity, ids[0], formData);
			} else {
				for (const [key, _] of formData.entries()) {
					if (!enabledFields.has(key) && key !== field) {
						formData.delete(key);
					}
				}
				await updateEntities(entity, ids, formData);
			}
			toast.success(`Successfully updated ${entityName}.`);
			setOpen(false);
		} catch {
			toast.error(
				<>
					<p>Failed to update {entityName}.</p>
					<p className="text-muted-foreground">Please try again.</p>
				</>,
			);
		} finally {
			setLoading(false);
		}
	}

	if (!open) return null;

	return (
		<DialogContent
			onPointerDownOutside={(e) => loading && e.preventDefault()}
			onEscapeKeyDown={(e) => loading && e.preventDefault()}
		>
			<form onSubmit={handleSubmit}>
				<DialogHeader>
					<DialogTitle>Update {entityName}</DialogTitle>
				</DialogHeader>
				<DialogSubContent>
					{fields.map((f) => {
						const value = getFieldValue(rows[0], f.name);
						const enabled = isFieldEnabled(f.name);
						return (
							<div key={f.name} className="relative flex items-start gap-2">
								{!single && (
									<Checkbox
										checked={enabled}
										onCheckedChange={() => toggleField(f.name)}
										aria-label={`Update ${f.name} for all selected rows`}
										className="absolute top-0 right-0 z-50 size-3.5"
									/>
								)}
								<FieldContent
									entity={entity}
									fields={fields}
									field={f}
									value={value}
									images={images}
									enabled={enabled}
									setImages={setImages}
								/>
							</div>
						);
					})}
				</DialogSubContent>
				<DialogFooter>
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

interface FieldContentProps {
	entity: EntityType;
	fields: FieldConfig[];
	field: FieldConfig;
	value: unknown;
	images: ImageItem[];
	enabled: boolean;
	setImages: Dispatch<SetStateAction<ImageItem[]>>;
}

function FieldContent({
	entity,
	fields,
	field,
	value,
	images,
	enabled,
	setImages,
}: FieldContentProps) {
	const { type, name, multiple, required, step, options } = field;
	const label = getFieldName(name);
	const placeholder = `Enter ${label.toLowerCase()}`;

	if (type === "string") {
		return (
			<Input
				name={name}
				label={label}
				required={required}
				disabled={!enabled}
				type={name === "email" ? "email" : "text"}
				placeholder={placeholder}
				defaultValue={value?.toString() || undefined}
			/>
		);
	}

	if (type === "text") {
		return (
			<TextArea
				name={name}
				label={label}
				required={required}
				disabled={!enabled}
				placeholder={placeholder}
				defaultValue={value?.toString() || undefined}
			/>
		);
	}

	if (type === "number") {
		return (
			<Input
				name={name}
				label={label}
				type="number"
				step={step ?? "1"}
				disabled={!enabled}
				required={required}
				placeholder={placeholder}
				defaultValue={value?.toString() || undefined}
			/>
		);
	}

	if (type === "date") {
		return (
			<DatePicker
				time
				name={name}
				label={label}
				disabled={!enabled}
				required={required}
				defaultValue={value as string | Date | undefined}
			/>
		);
	}

	if (type.includes("image")) {
		return (
			<ImageUpload
				name={name}
				label={label}
				images={images}
				required={required}
				onChange={setImages}
				multiple={multiple}
				disabled={!enabled}
			/>
		);
	}

	if (type === "enum") {
		return (
			<Select
				name={name}
				label={label}
				multiple={multiple}
				disabled={!enabled}
				required={required}
				items={options?.map((option) => ({
					label: option,
					value: option,
				}))}
				defaultValue={
					Array.isArray(value) && multiple
						? value.map((item) => item.toString())
						: value?.toString()
				}
			/>
		);
	}

	if (type === "foreignKey") {
		return (
			<ForeignKeySelect
				name={name}
				entity={entity}
				fields={fields}
				disabled={!enabled}
				required={required}
				defaultValue={value?.toString()}
			/>
		);
	}

	return null;
}
