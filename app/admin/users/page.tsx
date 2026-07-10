import { getPaginationParams } from "@/components/data-table/PaginationParams";
import {
  getUserCount,
  getUsersPage,
  type UserType,
} from "@/queries/UserQueries";
import {
  type PageProps,
  DataTableLayout,
} from "@/components/data-table/DataTableLayout";

const USERS_HEADER: string[] = [
  "User ID",
  "Firstname",
  "Lastname",
  "Email",
  "Role",
] as const;

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const totalCount = await getUserCount();
  const { page, totalPages } = getPaginationParams(params, totalCount);

  const users: UserType[] = await getUsersPage(page);
  const pageKey = params.page ?? "1";

  return (
    <DataTableLayout<UserType>
      pageKey={pageKey}
      header={USERS_HEADER}
      totalPages={totalPages}
      rows={users}
      basePath="/users"
    />
  );
}
