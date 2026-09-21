import ListStaticTooltip from "@/components/data-table/tooltips/ListStaticTooltip";
import UserTooltip from "@/components/data-table/tooltips/UserTooltip";
import {
	type ListEntityRow,
	type ListEntityType,
	OptionField,
} from "@/lib/entity/types";

interface EntityTooltipProps<T extends ListEntityType> {
	id: string | number;
	headerName: OptionField;
	row?: ListEntityRow<T>;
}

export default function EntityTooltip<T extends ListEntityType>({
	row,
	id,
	headerName,
}: EntityTooltipProps<T>) {
	if (headerName === OptionField.userId)
		return <UserTooltip id={id as string} />;
	return (
		<ListStaticTooltip<T>
			id={id as number}
			headerName={headerName as OptionField}
			row={row}
		/>
	);
}
