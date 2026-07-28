import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getUserCount,
  getUsersPage,
  USERS_HEADER,
  type UserType,
} from "@/queries/UserQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const totalCount = await getUserCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);

  const users: UserType[] = await getUsersPage(page);
  return (
    <DataTableLayout<UserType>
      header={USERS_HEADER}
      totalPages={totalPages}
      rows={users}
      basePath="/users"
    />
  );
}
