import DataTableLayout, {
	type PageProps,
} from "@/components/data-table/DataTableLayout";
import { getPaginationParams } from "@/components/data-table/PaginationParams";
import { getUserCount, getUsersPage } from "@/queries/UserQueries";
import { USERS_HEADER } from "./loading";

export default async function UsersPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const totalCount = await getUserCount();
	const { page, totalPages } = getPaginationParams(params, totalCount);

	const users = await getUsersPage(page);

	return (
		<DataTableLayout
			header={USERS_HEADER}
			totalPages={totalPages}
			entityRows={["users", users]}
			hasImage="one"
		/>
	);
}
