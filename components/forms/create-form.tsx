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
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { getEntityFields } from "@/lib/entity/entity-fields";
import { getFieldName, getSingleName } from "@/lib/entity/entity-functions";
import type { EntityType } from "@/lib/entity/types";

import { addImagesToForm } from "@/lib/uploadthing/client";
import ForeignKeySelect from "./ForeignKeySelect";

interface CreateFormProps {
	entity: EntityType;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateForm({ entity, open, setOpen }: CreateFormProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [images, setImages] = useState<ImageItem[]>([]);

	const fields = useMemo(() => getEntityFields(entity, "create"), [entity]);

	useEffect(() => {
		if (!open || entity !== "products") return;
		setImages([]);
		return;
	}, [open, entity]);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		setLoading(true);
		try {
			await addImagesToForm(formData, images);
			if (entity !== "users") await createEntity(entity, formData);
		} catch {
			toast.error(
				<>
					<p>Failed to create {getSingleName(entity)}.</p>
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
			className="w-180 max-w-180"
		>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<DialogHeader>
					<DialogTitle>Create {getSingleName(entity)}</DialogTitle>
				</DialogHeader>
				{fields.map((field) => {
					const { type, name, required, defaultValue } = field;
					const label = getFieldName(name);
					return type === "string" ? (
						<Input
							key={name}
							name={name}
							label={label}
							placeholder={`Enter ${label.toLowerCase()}`}
							type={name === "email" ? "email" : "text"}
							defaultValue={defaultValue?.toString() || undefined}
							required={required}
						/>
					) : type === "number" ? (
						<Input
							key={name}
							name={name}
							label={label}
							type="number"
							step={field.step ?? 1}
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
							defaultValue={defaultValue?.toString() || "NONE"}
							required={required}
							items={[
								{ label: "None", value: "NONE" },
								...(field.options?.map((o) => ({ label: o, value: o })) ?? []),
							]}
						/>
					) : type === "foreignKey" ? (
						<ForeignKeySelect
							key={name}
							field={field}
							entity={entity}
							fields={fields}
							defaultValue={defaultValue?.toString() || "NONE"}
							firstItem={{ label: "None", value: "NONE" }}
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
						Create
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
