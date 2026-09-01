import { unstable_cache, updateTag } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	IMAGE_PAGE_SIZE,
} from "@/components/pagination/PaginationParams";
import { checkedEnvVar } from "@/lib/env";
import { getFormUser } from "@/lib/entity/entity-form";
import { USERS_HEADER } from "@/lib/entity/entity-header";
import type { ParameterType, User } from "@/lib/entity/types";
import { prisma } from "@/lib/prisma";

const kindeIssuerUrl = checkedEnvVar("KINDE_ISSUER_URL");

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

async function getFilteredUsers(
	filterParams: ParameterType,
	sortBy?: string,
	order?: "asc" | "desc",
) {
	const cacheKey = [
		"kinde-filtered-users",
		JSON.stringify(filterParams),
		JSON.stringify({ sortBy, order }),
	];

	return unstable_cache(
		async () => {
			const users = await getUsers();
			return filterUsers(users, filterParams, sortBy, order);
		},
		cacheKey,
		{
			revalidate: Object.keys(filterParams).length
				? FILTER_CACHE_SECONDS
				: CACHE_SECONDS,
			tags: ["users"],
		},
	)();
}

async function getKindeToken() {
	const tokenUrl = `${kindeIssuerUrl}/oauth2/token`;

	const params = new URLSearchParams({
		grant_type: "client_credentials",
		client_id: checkedEnvVar("M2M_KINDE_CLIENT_ID"),
		client_secret: checkedEnvVar("M2M_KINDE_CLIENT_SECRET"),
		audience: `${kindeIssuerUrl}/api`,
	});

	const res = await fetch(tokenUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params,
		cache: "no-store",
	});

	const data = await res.json();

	return data.access_token;
}

async function getUsers(): Promise<User[]> {
	const token = await getKindeToken();

	const allUsers: User[] = [];
	let nextToken: string | null = null;

	while (true) {
		const url = new URL(`${kindeIssuerUrl}/api/v1/users`);

		if (nextToken) {
			url.searchParams.set("next_token", nextToken);
		}

		const res = await fetch(url.toString(), {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			},
			cache: "no-store",
		});

		const data = await res.json();

		if (data.users) {
			allUsers.push(...data.users);
		}

		if (!data.next_token) break;

		nextToken = data.next_token;
	}
	return allUsers;
}

async function getUsersPage(
	page: number = 1,
	order: "asc" | "desc" = "asc",
	sortBy: string = "id",
	filterParams: ParameterType = {},
	pageSize: number = IMAGE_PAGE_SIZE,
) {
	const users = await getFilteredUsers(filterParams, sortBy, order);
	const start = (page - 1) * pageSize;
	return users.slice(start, start + pageSize).map(mapUser);
}

async function getUserCount(filterParams: ParameterType = {}) {
	const users = await getFilteredUsers(filterParams);
	return users.length;
}

async function getUserById(id: string) {
	const token = await getKindeToken();

	const res = await fetch(`${kindeIssuerUrl}/api/v1/user?id=${id}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
		},
		cache: "no-store",
	});

	const user = await res.json();
	return mapUser(user);
}

async function deleteUser(id: string) {
	const token = await getKindeToken();

	const response = await fetch(`${kindeIssuerUrl}/api/v1/user?id=${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to delete user: ${response.status}`);
	}

	await prisma.cart.delete({ where: { userId: id } });
	updateTag("carts");

	await prisma.order.deleteMany({ where: { userId: id } });
	updateTag("orders");

	return response.json();
}

async function updateUser(id: string, formData: FormData) {
	const token = await getKindeToken();
	const data = getFormUser(formData);

	const response = await fetch(`${kindeIssuerUrl}/api/v1/user?id=${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error(`Failed to update user: ${response.status}`);
	}

	return response.json();
}

export {
	deleteUser,
	getFilteredUsers,
	getKindeToken,
	getUserById,
	getUserCount,
	getUsers,
	getUsersPage,
	kindeIssuerUrl,
	mapUser,
	updateUser,
};
