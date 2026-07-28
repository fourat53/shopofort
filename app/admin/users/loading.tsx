import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";
import { USERS_HEADER } from "@/queries/UserQueries";

export default function loading() {
  return <DataTableSkeleton header={USERS_HEADER} />;
}
