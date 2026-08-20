import type {
	EntityField,
	FieldConfig,
	ValueType,
} from "@/lib/entity/current-entity";
import { getHeaderFromName } from "@/lib/entity/entity-header";
import { DatePicker } from "../form-items/date-picker";
import { type ImageItem, ImageUpload } from "../form-items/image-upload";
import { Input } from "../form-items/input";
import { Select, type SelectOption } from "../form-items/select";

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

const anyOption: SelectOption = { label: "Any", value: "ALL" } as const;

interface DialogFieldProps {
	filter?: boolean;
	field: FieldConfig;
	value: ValueType;
	images?: ImageItem[];
	onImagesChange?: (images: ImageItem[]) => void;
	optionsCache: Record<string, SelectOption[]>;
	getValue: (field: EntityField, paramName?: string) => ValueType;
}

export default function DialogField({
	field,
	value,
	getValue,
	images,
	onImagesChange,
	optionsCache,
	filter,
}: DialogFieldProps) {
	return (
		<>
			{field.type === "string" ? (
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
								getValue(field, `${field.name}From`)?.toString() || undefined
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
							defaultValue={toDateValue(getValue(field, `${field.name}From`))}
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
						...(filter ? [] : [anyOption]),
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
					onChange={onImagesChange ?? (() => {})}
				/>
			) : (
				field.type === "foreignKey" && (
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
							...(filter ? [] : [anyOption]),
							...(optionsCache[field.name] ?? []),
						]}
					/>
				)
			)}
		</>
	);
}
