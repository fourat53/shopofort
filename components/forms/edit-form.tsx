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
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { getEntityFields } from "@/lib/entity/fields";
import {
	getFieldName,
	getPluralName,
	getSingleName,
} from "@/lib/entity/functions";
import type { EntityType, RowType } from "@/lib/entity/types";
import { addImagesToForm } from "@/lib/uploadthing/client";
import ForeignKeySelect from "./ForeignKeySelect";

interface DialogFormProps<T> {
	entity: EntityType;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	rows: T[];
}

export default function CreateEditForm<T extends RowType>({
	entity,
	open,
	setOpen,
	rows,
}: DialogFormProps<T>) {
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<ImageItem[]>([]);

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

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		setLoading(true);
		try {
			await addImagesToForm(formData, images);
			single
				? await updateEntity(entity, ids[0], formData)
				: await updateEntities(entity, ids, formData);
		} catch {
			toast.error(
				<>
					<p>
						Failed to update{" "}
						{single ? getSingleName(entity) : getPluralName(entity)}.
					</p>
					<p className="text-muted-foreground">Please try again.</p>
				</>,
			);
		} finally {
			setOpen(false);
			setLoading(false);
		}
	}

	if (!open) return null;

	return (
		<DialogContent
			onPointerDownOutside={(e) => loading && e.preventDefault()}
			onEscapeKeyDown={(e) => loading && e.preventDefault()}
			className="px-0 w-180 max-w-180 overflow-hidden"
		>
			<form onSubmit={handleSubmit}>
				<DialogHeader className="pb-2">
					<DialogTitle>{label}</DialogTitle>
				</DialogHeader>
				<div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-4 flex flex-col gap-4">
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
								type={name === "email" ? "email" : "text"}
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
								defaultValue={value?.toString()}
								required={required}
								items={field.options?.map((o) => ({ label: o, value: o }))}
							/>
						) : type === "foreignKey" ? (
							<ForeignKeySelect
								key={name}
								field={field}
								entity={entity}
								fields={fields}
								defaultValue={value?.toString()}
							/>
						) : null;
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
