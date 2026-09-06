import ServerTooltip from "@/components/data-table/tooltips/StaticTooltip";
import UserTooltip from "@/components/data-table/tooltips/UserTooltip";
import { OptionField, type RowType } from "@/lib/entity/types";

interface TooltipEntityProps<T> {
	row?: T;
	id: string | number;
	headerName: OptionField;
}

export default function EntityTooltip<T extends RowType>({
	row,
	id,
	headerName,
}: TooltipEntityProps<T>) {
	if (headerName === OptionField.userId)
		return <UserTooltip id={id as string} />;
	return (
		<ServerTooltip row={row} id={id} headerName={headerName as OptionField} />
	);
}
