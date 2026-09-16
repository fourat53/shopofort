import StaticTooltip from "@/components/data-table/tooltips/StaticTooltip";
import UserTooltip from "@/components/data-table/tooltips/UserTooltip";
import {
	type EntityRow,
	type EntityType,
	OptionField,
} from "@/lib/entity/types";

export interface TooltipEntityProps<T extends EntityType> {
	id: string | number;
	headerName: OptionField;
	row?: EntityRow<T>;
}

export default function EntityTooltip<T extends EntityType>({
	row,
	id,
	headerName,
}: TooltipEntityProps<T>) {
	if (headerName === OptionField.userId)
		return <UserTooltip id={id as string} />;
	return (
		<StaticTooltip<T>
			id={id as number}
			headerName={headerName as OptionField}
			row={row}
		/>
	);
}
