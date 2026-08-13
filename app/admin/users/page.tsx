import DataTable, { type PageProps } from "@/components/data-table/DataTable";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { User } from "@/lib/types";
import { getUserCount, getUsersPage } from "@/queries/UserQueries";
import { USERS_HEADER } from "./loading";

export default async function UsersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page: _pageParam, ...filterParams } = params;

	const totalCount = await getUserCount(filterParams);
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const users: User[] = await getUsersPage(page, filterParams);

	return (
		<DataTable<User>
			header={USERS_HEADER}
			totalPages={totalPages}
			rows={users}
			basePath="users"
			hasImage="one"
		/>
	);
}
