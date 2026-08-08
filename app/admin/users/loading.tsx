import DataTableSkeleton from "@/components/data-table/DataTableSkeleton";

export const USERS_HEADER: string[] = [
	"User ID",
	"Picture",
	"Email",
	"First Name",
	"Last Name",
	"Suspended",
	"Total Sign-ins",
	"Failed Sign-ins",
	"Last Signed In",
	"Created On",
	"Updated On",
] as const;

export default function loading() {
	return <DataTableSkeleton header={USERS_HEADER} hasImage="one" />;
}
