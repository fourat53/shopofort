"use client";

import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { getFilterOptions } from "@/actions/EntityActions";
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
import type {
	EntityField,
	FieldCategory,
	ValueType,
} from "@/lib/entity/current-entity";
import { getHeaderFromName } from "@/lib/entity/entity-header";
import { addImagesToForm } from "@/lib/uploadthing/client";

const toArrayValue = (value: ValueType): string[] | undefined => {
	if (value === undefined) return undefined;
	if (Array.isArray(value)) return value.map(String);
	return [String(value)];
};

const toDateValue = (value: ValueType): string | Date | undefined => {
	if (value === undefined || Array.isArray(value)) return undefined;
	if (typeof value === "number") return undefined;
	return value;
};

interface DialogFormProps {
	entity: string;
	label: string;
	fields: EntityField[];
	loading: boolean;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	handleSubmit: (formData: FormData) => void;
	type: FieldCategory;
	rowImages?: string[];
	getValue: (field: EntityField, paramName?: string) => ValueType;
}

export default function CreateEditForm({
	entity,
	label,
	fields,
	loading,
	open,
	setOpen,
	handleSubmit,
	type,
	rowImages,
	getValue,
}: DialogFormProps) {
	const [images, setImages] = useState<ImageItem[]>([]);
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});

	const fetchedFields = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (!open || type === "filter" || entity !== "product") return;

		if (type === "create") {
			setImages([]);
			return;
		}

		if (type === "edit") setImages(Array.isArray(rowImages) ? rowImages : []);
	}, [open, type, entity, rowImages]);

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

	async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		await addImagesToForm(formData, images);
		await handleSubmit(formData);
	}

	const filter = type === "filter";

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
					return field.type === "string" ? (
						<Input
							key={field.name}
							name={field.name}
							label={getHeaderFromName(field.name)}
							defaultValue={value?.toString() || undefined}
							required={!filter && field.required}
						/>
					) : field.type === "number" ? (
						filter ? (
							<div key={field.name} className="flex w-full gap-2">
								<Input
									name={`${field.name}From`}
									label={`${getHeaderFromName(field.name)} From`}
									type="number"
									step={field.step ?? "1"}
									defaultValue={
										getValue(field, `${field.name}From`)?.toString() ||
										undefined
									}
								/>
								<Input
									name={`${field.name}To`}
									label={`${getHeaderFromName(field.name)} To`}
									type="number"
									step={field.step ?? "1"}
									defaultValue={
										getValue(field, `${field.name}To`)?.toString() || undefined
									}
								/>
							</div>
						) : (
							<Input
								key={field.name}
								name={field.name}
								label={getHeaderFromName(field.name)}
								type="number"
								step={field.step ?? "1"}
								defaultValue={value?.toString() || undefined}
								required={!filter && field.required}
							/>
						)
					) : field.type === "date" ? (
						filter ? (
							<div key={field.name} className="w-full flex gap-2">
								<DatePicker
									name={`${field.name}From`}
									label={`${getHeaderFromName(field.name)} From`}
									defaultValue={toDateValue(
										getValue(field, `${field.name}From`),
									)}
								/>
								<DatePicker
									name={`${field.name}To`}
									label={`${getHeaderFromName(field.name)} To`}
									defaultValue={toDateValue(getValue(field, `${field.name}To`))}
								/>
							</div>
						) : (
							<DatePicker
								key={field.name}
								name={field.name}
								label={getHeaderFromName(field.name)}
								defaultValue={toDateValue(value)}
								required={field.required}
							/>
						)
					) : field.type === "enum" ? (
						<Select
							key={field.name}
							name={field.name}
							label={getHeaderFromName(field.name)}
							placeholder={filter ? "Select options" : "Select an option"}
							multiple={filter}
							defaultValue={
								filter
									? toArrayValue(getValue(field, field.name))
									: value?.toString() || "ALL"
							}
							required={!filter && field.required}
							items={[
								...(filter ? [] : [{ label: "Any", value: "ALL" }]),
								...(field.options?.map((o) => ({ label: o, value: o })) ?? []),
							]}
						/>
					) : field.type === "image" ? (
						<ImageUpload
							key={field.name}
							name={field.name}
							label={getHeaderFromName(field.name)}
							images={images ?? []}
							required={!filter && field.required}
							onChange={setImages ?? (() => {})}
						/>
					) : field.type === "foreignKey" ? (
						<Select
							key={field.name}
							name={field.name}
							label={getHeaderFromName(field.name)}
							placeholder={filter ? "Select options" : "Select an option"}
							required={!filter && field.required}
							multiple={filter}
							defaultValue={
								filter
									? toArrayValue(getValue(field, field.name))
									: value?.toString() || "ALL"
							}
							items={[
								...(filter ? [] : [{ label: "Any", value: "ALL" }]),
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
						{label.split(" ")[0]}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
