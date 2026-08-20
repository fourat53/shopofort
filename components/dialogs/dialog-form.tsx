"use client";

import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { getFilterOptions } from "@/actions/EntityActions";
import type { ImageItem } from "@/components/form-items/image-upload";
import type { SelectOption } from "@/components/form-items/select";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type {
	EntityField,
	FieldCategory,
	ValueType,
} from "@/lib/entity/current-entity";
import DialogField from "./dialog-field";
import { addImagesToForm } from "@/lib/uploadthing/client";

interface DialogFormProps {
	entity: string;
	label: string;
	fields: EntityField[];
	loading: boolean;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	handleSubmit: (formData: FormData) => void;
	getValue: (field: EntityField, paramName?: string) => ValueType;
	rowImages?: string[];
	type: FieldCategory;
}

export default function DialogForm({
	entity,
	label,
	fields,
	loading,
	open,
	setOpen,
	handleSubmit,
	getValue,
	type,
	rowImages = [],
}: DialogFormProps) {
	const [images, setImages] = useState<ImageItem[]>([]);
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});

	const fetchedFields = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (!open || !entity) return;

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
	}, [open, entity, fields]);

	useEffect(() => {
		if (open) {
			if (type === "filter") return;
			else if (type === "create") setImages([]);
			else if (type === "edit")
				setImages(Array.isArray(rowImages) ? rowImages : []);
		}
	}, [type, open, rowImages]);

	async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		await addImagesToForm(formData, images);
		await handleSubmit(formData);
	}

	return (
		<DialogContent
			onPointerDownOutside={(e) => loading && e.preventDefault()}
			onEscapeKeyDown={(e) => loading && e.preventDefault()}
			className="w-180 max-w-180"
		>
			<form onSubmit={onSubmit} className="flex flex-col gap-4">
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
				</DialogHeader>

				{fields.map((field) => {
					const value = getValue(field);
					return (
						<DialogField
							key={field.name}
							field={field}
							optionsCache={optionsCache}
							value={value}
							getValue={getValue}
							images={images}
							onImagesChange={setImages}
							filter={type === "filter"}
						/>
					);
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
						{label.split(" ")[0]}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
