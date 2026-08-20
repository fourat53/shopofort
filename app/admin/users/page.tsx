import { getUserCount, getUsersPage } from "@/actions/UserActions";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import {
	getTotalPages,
	type PageProps,
} from "@/components/data-table/PaginationParams";
import { USERS_HEADER } from "@/lib/entity/entity-header";
import type { User } from "@/lib/entity/types";

export default async function UsersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { page, sortBy, order, ...filterParams } = params;

	const totalCount = await getUserCount(filterParams);
	const totalPages = getTotalPages(totalCount, true);

	const users: User[] = await getUsersPage(
		Number(page),
		filterParams,
		sortBy,
		order,
	);

	return (
		<DataTableLayout<User>
			header={USERS_HEADER}
			totalPages={totalPages}
			rows={users}
			basePath="users"
			suspenseKey={params}
			hasImage="one"
		/>
	);
}
