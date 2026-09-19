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
import ForeignKeySelect from "@/components/forms/ForeignKeySelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { getEntityFields } from "@/lib/entity/fields";
import type { EntityRow, EntityType } from "@/lib/entity/types";
import {
	getFieldName,
	getFieldValue,
	getPluralName,
	getSingleName,
} from "@/lib/functions/client";
import { addImages, uploadConfig } from "@/lib/uploadthing/client";
import { TextArea } from "../form-items/textarea";

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
		if (!open) return;

		if (!field || rows.length === 0) {
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
			className="px-0 w-82 sm:w-180 max-w-180 overflow-hidden"
		>
			<form onSubmit={handleSubmit}>
				<DialogHeader className="pb-2">
					<DialogTitle>Update {entityName}</DialogTitle>
				</DialogHeader>
				<div className="max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto px-4 flex flex-col gap-4">
					{fields.map((f) => {
						const value = getFieldValue(rows[0], f.name);
						const { type, name, multiple, required } = f;
						const label = getFieldName(name);
						const enabled = isFieldEnabled(name);

						const fieldContent =
							type === "string" ? (
								<Input
									key={name}
									name={name}
									label={label}
									type={name === "email" ? "email" : "text"}
									placeholder={`Enter ${label.toLowerCase()}`}
									defaultValue={value?.toString() || undefined}
									required={required}
									disabled={!enabled}
								/>
							) : type === "text" ? (
								<TextArea
									key={name}
									name={name}
									label={label}
									placeholder={`Enter ${label.toLowerCase()}`}
									defaultValue={value?.toString() || undefined}
									required={required}
									disabled={!enabled}
								/>
							) : type === "number" ? (
								<Input
									key={name}
									name={name}
									label={label}
									type="number"
									step={f.step ?? "1"}
									placeholder={`Enter ${label.toLowerCase()}`}
									defaultValue={value?.toString() || undefined}
									required={required}
									disabled={!enabled}
								/>
							) : type === "date" ? (
								<DatePicker
									key={name}
									name={name}
									label={label}
									defaultValue={value as string | Date | undefined}
									required={required}
									time
									disabled={!enabled}
								/>
							) : type.includes("image") ? (
								<ImageUpload
									key={name}
									name={name}
									label={label}
									images={images}
									required={required}
									onChange={setImages}
									multiple={multiple}
									disabled={!enabled}
								/>
							) : type === "enum" ? (
								<Select
									key={name}
									name={name}
									label={label}
									required={required}
									multiple={multiple}
									items={f.options?.map((o) => ({ label: o, value: o }))}
									defaultValue={
										Array.isArray(value) && multiple
											? value.map((item) => item.toString())
											: value?.toString()
									}
									disabled={!enabled}
								/>
							) : type === "foreignKey" ? (
								<ForeignKeySelect
									key={name}
									field={f}
									entity={entity}
									fields={fields}
									defaultValue={value?.toString()}
									disabled={!enabled}
								/>
							) : null;

						return (
							<div key={name} className="flex items-start gap-2">
								{!single && (
									<Checkbox
										checked={enabled}
										onCheckedChange={() => toggleField(name)}
										aria-label={`Update ${label} for all selected rows`}
										className="size-3.5"
									/>
								)}
								{fieldContent}
							</div>
						);
					})}
				</div>
				<DialogFooter className="pt-3">
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
