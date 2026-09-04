import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { getFilterOptions } from "@/actions/EntityActions";
import { Select, type SelectOption } from "@/components/form-items/select";
import type { FieldConfig } from "@/lib/entity/fields";
import {
	getFieldName,
	getForeignKeyName,
	getSingleName,
} from "@/lib/entity/functions";
import type { EntityType, OptionField } from "@/lib/entity/types";

interface ForeignKeySelectProps {
	field: FieldConfig;
	fields: { name: string; type: string }[];
	entity: EntityType;
	multiple?: boolean;
	defaultValue: string | string[] | undefined;
}

export default function ForeignKeySelect({
	field: { name, required = false },
	fields,
	entity,
	multiple = false,
	defaultValue,
}: ForeignKeySelectProps) {
	const fetchedFields = useRef<Set<string>>(new Set());

	const [loadingCache, setLoadingCache] = useState<Record<string, boolean>>({});
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
				setLoadingCache((current) => ({
					...current,
					[field.name]: true,
				}));
				try {
					const options = await getFilterOptions(optionField as OptionField);
					setOptionsCache((current) => ({
						...current,
						[field.name]: options,
					}));
				} catch {
					fetchedFields.current.delete(optionField);
					toast.error(
						<>
							<p>Failed to fetch {getSingleName(entity)} options.</p>
							<p className="text-muted-foreground">Please try again.</p>
						</>,
					);
				} finally {
					setLoadingCache((current) => ({
						...current,
						[field.name]: false,
					}));
				}
			}
		}

		loadOptions();
	}, [fields, entity]);

	return (
		<Select
			key={name}
			name={name}
			multiple={multiple}
			loading={loadingCache[name] ?? false}
			required={required}
			label={getFieldName(name)}
			defaultValue={defaultValue}
			items={optionsCache[name] ?? []}
		/>
	);
}
