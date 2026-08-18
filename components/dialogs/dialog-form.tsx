"use client";

import { DatePicker } from "@/components/form-items/date-picker";
import { Input } from "@/components/form-items/input";
import { Select, type SelectOption } from "@/components/form-items/select";
import type { entityFields } from "@/lib/entity/current-entity";
import { getHeaderFromName } from "@/lib/entity/entity-header";

type EntityField = (typeof entityFields)[string][number];

interface DialogFormProps {
	fields: EntityField[];
	optionsCache: Record<string, SelectOption[]>;
	getValue: (field: EntityField) => string | number | Date | undefined;
	filter?: boolean;
}

export default function DialogForm({
	fields,
	optionsCache,
	getValue,
	filter = false,
}: DialogFormProps) {
	return (
		<div
			className={
				filter ? "flex flex-col gap-4 py-4" : "flex flex-col gap-2 pt-2"
			}
		>
			{fields.map((field) => {
				const value = getValue(field);

				return (
					<div key={field.name} className="flex flex-col gap-2">
						{field.type === "string" && (
							<Input
								name={field.name}
								label={getHeaderFromName(field.name)}
								defaultValue={value?.toString() ?? ""}
								required={field.required}
							/>
						)}

						{field.type === "number" && (
							<Input
								name={field.name}
								label={getHeaderFromName(field.name)}
								type="number"
								step={field.step ?? "1"}
								defaultValue={
									value !== null && value !== undefined ? String(value) : ""
								}
								required={field.required}
							/>
						)}

						{field.type === "date" && (
							<DatePicker
								name={field.name}
								label={getHeaderFromName(field.name)}
								defaultValue={value ? new Date(value) : undefined}
								required={field.required}
							/>
						)}

						{field.type === "enum" && (
							<Select
								name={field.name}
								label={getHeaderFromName(field.name)}
								defaultValue={value?.toString() || undefined}
								placeholder="Select an option"
								items={[
									...(filter ? [{ label: "Any", value: "ALL" }] : []),
									...(field.enumValues?.map((enumValue) => ({
										label: enumValue,
										value: enumValue,
									})) ?? []),
								]}
								required={field.required}
							/>
						)}

						{field.type === "foreignKey" && (
							<Select
								name={field.name}
								label={getHeaderFromName(field.name)}
								placeholder="Select an option"
								defaultValue={
									value !== null && value !== undefined ? String(value) : ""
								}
								items={[
									...(filter ? [{ label: "Any", value: "ALL" }] : []),
									...(optionsCache[field.name] ?? []),
								]}
								required={field.required}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
