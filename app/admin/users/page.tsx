import { getUserCount, getUsersPage } from "@/actions/UserActions";
import DataTable from "@/components/data-table/DataTable";
import {
	getPaginationParams,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { USERS_HEADER } from "@/lib/entity/entity-header";
import type { User } from "@/lib/entity/types";

export default async function UsersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _page, sortBy, order, ...filterParams } = params;

	const totalCount = await getUserCount(filterParams);
	const { page, totalPages } = getPaginationParams(
		params.page,
		totalCount,
		true,
	);

	const users: User[] = await getUsersPage(page, filterParams, sortBy, order);

	return (
		<DataTable<User>
			header={USERS_HEADER}
			totalPages={totalPages}
			rows={users}
			basePath="users"
			suspenseKey={params}
			hasImage="one"
		/>
	);
}
