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
	filterParams: ParameterType = {},
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
): User[] {
	users = users.map(mapUser);

	if (Object.keys(filterParams).length) {
		const ids = getAllParams(filterParams, "id");
		const email = getParam(filterParams, "email")?.toLowerCase();
		const firstName = getParam(filterParams, "first_name")?.toLowerCase();
		const lastName = getParam(filterParams, "last_name")?.toLowerCase();
		const is_suspended = getParam(filterParams, "is_suspended");
		const totalSignInsFrom = getParam(filterParams, "total_sign_insFrom");
		const totalSignInsTo = getParam(filterParams, "total_sign_insTo");
		const failedSignInsFrom = getParam(filterParams, "failed_sign_insFrom");
		const failedSignInsTo = getParam(filterParams, "failed_sign_insTo");
		const lastSignedInFrom = getParam(filterParams, "last_signed_inFrom");
		const lastSignedInTo = getParam(filterParams, "last_signed_inTo");
		const createdOnFrom = getParam(filterParams, "created_onFrom");
		const createdOnTo = getParam(filterParams, "created_onTo");
		const updatedOnFrom = getParam(filterParams, "updated_onFrom");
		const updatedOnTo = getParam(filterParams, "updated_onTo");

		users = users.filter((user) => {
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
	}

	if (order === "asc" && sortBy === "id") return users;

	const sortableColumns = new Set(USERS_HEADER.map((header) => header.name));

	if (!sortableColumns.has(sortBy)) return users;

	return users.toSorted((a, b) => {
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
