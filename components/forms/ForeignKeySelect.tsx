import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getFilterOptions } from "@/actions/EntityActions";
import { Select, type SelectOption } from "@/components/form-items/select";
import type { FieldConfig } from "@/lib/entity/entity-fields";
import {
	getFieldName,
	getForeignKeyName,
	getPluralName,
} from "@/lib/entity/entity-functions";
import type { EntityType, OptionField } from "@/lib/entity/types";

interface ForeignKeySelectProps {
	field: FieldConfig;
	fields: { name: string; type: string }[];
	entity: EntityType;
	firstItem: { label: "All"; value: "ALL" } | { label: "None"; value: "NONE" };
	defaultValue: string | string[] | undefined;
}

export default function ForeignKeySelect({
	field: { name, required = false },
	fields,
	entity,
	firstItem,
	defaultValue,
}: ForeignKeySelectProps) {
	const fetchedFields = useRef<Set<string>>(new Set());
	const [optionsCache, setOptionsCache] = useState<
		Record<string, SelectOption[]>
	>({});

	useEffect(() => {
		async function loadOptions() {
			for (const field of fields) {
				if (field.type !== "foreignKey") continue;
				const optionField =
					field.name === "id" ? getForeignKeyName(entity) : field.name;

				if (fetchedFields.current.has(optionField)) continue;
				fetchedFields.current.add(optionField);
				try {
					const options = await getFilterOptions(optionField as OptionField);
					setOptionsCache((current) => ({
						...current,
						[field.name]: options,
					}));
				} catch {
					toast.error(
						<>
							<p>Failed to filter ${getPluralName(entity)}.</p>
							<p className="text-muted-foreground">Please try again.</p>
						</>,
					);
					fetchedFields.current.delete(optionField);
				}
			}
		}
		loadOptions();
	}, [fields, entity]);

	return (
		<Select
			multiple
			key={name}
			name={name}
			required={required}
			label={getFieldName(name)}
			defaultValue={defaultValue}
			items={[firstItem, ...(optionsCache[name] ?? [])]}
		/>
	);
}
