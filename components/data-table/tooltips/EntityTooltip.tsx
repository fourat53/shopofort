import { OptionField, type RowType } from "@/lib/entity/types";
import ServerTooltip from "./StaticTooltip";
import UserTooltip from "./UserTooltip";

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
