import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";

export const USERS_HEADER: string[] = [
	"User ID",
	"Picture",
	"First Name",
	"Last Name",
	"Username",
	"Email",
	"Suspended",
	"Total Sign-ins",
	"Failed Sign-ins",
	"Last Signed In",
	"Created At",
	"Updated At",
] as const;

export default function loading() {
	return <DataTableSkeleton header={USERS_HEADER} hasImage="one" />;
}
