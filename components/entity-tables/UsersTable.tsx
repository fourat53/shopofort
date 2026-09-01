import { getUsersPage } from "@/actions/UserActions";
import DataTable from "@/components/data-table/DataTable";
import type { EntityTableProps } from "@/components/entity-tables/EntityTable";
import type { User } from "@/lib/entity/types";

export default async function UsersTable({
	entity,
	header,
	page,
	order,
	sortBy,
	filterParams,
	pageSize,
	dialog,
}: EntityTableProps) {
	const rows: User[] = await getUsersPage(
		page,
		order,
		sortBy,
		filterParams,
		pageSize,
	);
	return (
		<DataTable<User>
			header={header}
			rows={rows}
			entity={entity}
			dialog={dialog}
		/>
	);
}
