import { USERS_HEADER } from "@/lib/entity/headers";
import type { ParameterType, User } from "@/lib/entity/types";

function mapUser(user: User): User {
	return {
		id: user.id,
		picture: user.picture,
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name,
		is_suspended: user.is_suspended,
		total_sign_ins: user.total_sign_ins,
		failed_sign_ins: user.failed_sign_ins,
		last_signed_in: user.last_signed_in,
		created_on: user.created_on,
		updated_on: user.created_on,
	};
}

function getParam(
	searchParams: ParameterType,
	name: string,
): string | undefined {
	const value = searchParams[name];
	return Array.isArray(value) ? value[0] : value;
}

function getAllParams(
	searchParams: ParameterType,
	name: string,
): string[] | undefined {
	const value = searchParams[name];
	return Array.isArray(value) ? value : value ? [value] : undefined;
}

function filterUsers(
	users: User[],
	searchParams: ParameterType,
	sortBy?: string,
	order?: "asc" | "desc",
) {
	const ids = getAllParams(searchParams, "id");
	const email = getParam(searchParams, "email")?.toLowerCase();
	const firstName = getParam(searchParams, "first_name")?.toLowerCase();
	const lastName = getParam(searchParams, "last_name")?.toLowerCase();
	const is_suspended = getParam(searchParams, "is_suspended");

	const totalSignInsFrom = getParam(searchParams, "total_sign_insFrom");
	const totalSignInsTo = getParam(searchParams, "total_sign_insTo");

	const failedSignInsFrom = getParam(searchParams, "failed_sign_insFrom");
	const failedSignInsTo = getParam(searchParams, "failed_sign_insTo");

	const lastSignedInFrom = getParam(searchParams, "last_signed_inFrom");
	const lastSignedInTo = getParam(searchParams, "last_signed_inTo");

	const createdOnFrom = getParam(searchParams, "created_on");
	const createdOnTo = getParam(searchParams, "created_on");

	const updatedOnFrom = getParam(searchParams, "updated_on");
	const updatedOnTo = getParam(searchParams, "updated_on");

	const filteredUsers = users.filter((user) => {
		if (ids?.length && !ids.includes(user.id)) return false;

		if (email && !user.email?.toLowerCase().includes(email)) return false;

		if (firstName && !user.first_name?.toLowerCase().includes(firstName))
			return false;

		if (lastName && !user.last_name?.toLowerCase().includes(lastName))
			return false;

		if (is_suspended && String(user.is_suspended) !== is_suspended)
			return false;

		if (totalSignInsFrom && user.total_sign_ins < Number(totalSignInsFrom))
			return false;

		if (totalSignInsTo && user.total_sign_ins > Number(totalSignInsTo))
			return false;

		if (failedSignInsFrom && user.failed_sign_ins < Number(failedSignInsFrom))
			return false;

		if (failedSignInsTo && user.failed_sign_ins > Number(failedSignInsTo))
			return false;

		if (
			lastSignedInFrom &&
			(!user.last_signed_in ||
				new Date(user.last_signed_in) < new Date(lastSignedInFrom))
		)
			return false;

		if (
			lastSignedInTo &&
			(!user.last_signed_in ||
				new Date(user.last_signed_in) > new Date(lastSignedInTo))
		)
			return false;

		if (createdOnFrom && new Date(user.created_on) < new Date(createdOnFrom))
			return false;

		if (createdOnTo && new Date(user.created_on) > new Date(createdOnTo))
			return false;

		if (updatedOnFrom && new Date(user.updated_on) < new Date(updatedOnFrom))
			return false;

		if (updatedOnTo && new Date(user.updated_on) > new Date(updatedOnTo))
			return false;

		return true;
	});

	if (!sortBy || !order) return filteredUsers;

	const sortableColumns = new Set(USERS_HEADER.map((header) => header.name));

	if (!sortableColumns.has(sortBy)) return filteredUsers;

	return filteredUsers.toSorted((a, b) => {
		const aValue = a[sortBy as keyof User];
		const bValue = b[sortBy as keyof User];

		const aString = String(aValue ?? "").toLowerCase();
		const bString = String(bValue ?? "").toLowerCase();

		const comparison = aString.localeCompare(bString, undefined, {
			numeric: true,
			sensitivity: "base",
		});

		return order === "desc" ? -comparison : comparison;
	});
}

export { filterUsers, mapUser };
