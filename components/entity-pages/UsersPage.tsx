import { getUserCount, getUsersPage } from "@/actions/UserActions";
import type { PageProps } from "@/app/admin/[entity]/page";
import DataTableLayout from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import type { User } from "@/lib/entity/types";

export default async function UsersPage({ searchParams, header }: PageProps) {
	const { page: _page, sortBy, order, ...filterParams } = searchParams;
	const totalCount = await getUserCount(filterParams);
	const { page, totalPages } = getPaginationParams(_page, totalCount);
	const users: User[] = await getUsersPage(page, filterParams, sortBy, order);
	return (
		<DataTableLayout<User>
			header={header}
			totalPages={totalPages}
			rows={users}
			entity="users"
			hasImage="one"
		/>
	);
}
