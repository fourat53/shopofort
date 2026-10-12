"use client";

import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import { createEntity } from "@/actions/EntityActions";
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
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogSubContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { getEntityFields } from "@/lib/entity/fields";
import { validateEntityForm } from "@/lib/entity/schemas";
import type { EntityType } from "@/lib/entity/types";
import { getFieldName, getSingleName } from "@/lib/functions/client";
import { addImages } from "@/lib/uploadthing/client";
import { ValidationError } from "../dialog-content/ValidationError";

interface CreateFormProps {
	entity: EntityType;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateForm({ entity, open, setOpen }: CreateFormProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<ImageItem[]>([]);

	const fields = useMemo(() => getEntityFields(entity, "create"), [entity]);
	const entityName = getSingleName(entity);

	useEffect(() => {
		if (!open) setImages([]);
	}, [open]);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const validation = validateEntityForm(entity, formData, "create");
		if (!validation.success) {
			toast.error(
				ValidationError("create", entityName, validation.fieldErrors),
			);
			return;
		}

		setLoading(true);
		try {
			await addImages(entity, formData, images);
			const result = await createEntity(entity, formData);
			if (!result.success) {
				toast.error(ValidationError("create", entityName, result.fieldErrors));
				return;
			}
			toast.success(`Successfully created ${entityName}.`);
			setOpen(false);
		} catch {
			toast.error(
				<>
					<p>Failed to create {entityName}.</p>
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
					<DialogTitle>Create {entityName}</DialogTitle>
				</DialogHeader>
				<DialogSubContent>
					{fields.map((f) => {
						const { type, name, multiple, required, defaultValue } = f;
						const label = getFieldName(name);
						return type === "string" ? (
							<Input
								key={name}
								name={name}
								label={label}
								type={name === "email" ? "email" : "text"}
								placeholder={`Enter ${label.toLowerCase()}`}
								defaultValue={defaultValue?.toString() || undefined}
								required={required}
							/>
						) : type === "text" ? (
							<TextArea
								key={name}
								name={name}
								label={label}
								placeholder={`Enter ${label.toLowerCase()}`}
								defaultValue={defaultValue?.toString() || undefined}
								required={required}
							/>
						) : type === "number" ? (
							<Input
								key={name}
								name={name}
								label={label}
								type="number"
								step={f.step ?? 1}
								placeholder={`Enter ${label.toLowerCase()}`}
								defaultValue={defaultValue?.toString() || "1"}
								required={required}
							/>
						) : type === "date" ? (
							<DatePicker
								key={name}
								name={name}
								label={label}
								defaultValue={defaultValue as string | Date | undefined}
								required={required}
								time
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
							/>
						) : type === "enum" ? (
							<Select
								key={name}
								name={name}
								label={label}
								multiple={multiple}
								required={required}
								defaultValue={defaultValue?.toString()}
								items={f.options?.map((o) => ({ label: o, value: o }))}
							/>
						) : type === "foreignKey" ? (
							<ForeignKeySelect
								key={name}
								name={name}
								entity={entity}
								fields={fields}
								required={required}
								defaultValue={defaultValue?.toString()}
							/>
						) : null;
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
						Create
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
