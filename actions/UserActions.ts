import { unstable_cache } from "next/cache";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	IMAGE_PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { checkedEnvVar } from "@/lib/checked-env-var";
import { getFormUser } from "@/lib/entity/entity-form";
import { USERS_HEADER } from "@/lib/entity/entity-header";
import type { ParameterType, PreferredUser, User } from "@/lib/entity/types";

const kindeIssuerUrl = checkedEnvVar("KINDE_ISSUER_URL");

function mapUser(user: PreferredUser | User): User {
	const email = "email" in user ? user.email : user.preferred_email;
	return {
		id: user.id,
		picture: user.picture,
		email,
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

function filterUsers(
	users: User[],
	searchParams: ParameterType,
	sortBy?: string,
	order?: "asc" | "desc",
) {
	const id = getParam(searchParams, "id")?.toLowerCase();
	const email = getParam(searchParams, "email")?.toLowerCase();
	const firstName = getParam(searchParams, "first_name")?.toLowerCase();
	const lastName = getParam(searchParams, "last_name")?.toLowerCase();

	const filteredUsers = users.filter((user) => {
		if (id && !user.id.toLowerCase().includes(id)) return false;
		if (email && !user.email?.toLowerCase().includes(email)) return false;
		if (firstName && !user.first_name?.toLowerCase().includes(firstName))
			return false;
		if (lastName && !user.last_name?.toLowerCase().includes(lastName))
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

function getFilteredUsers(
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
	page: number,
	filterParams: ParameterType = {},
	sortBy: string = "id",
	order: "asc" | "desc" = "asc",
) {
	const users = await getFilteredUsers(filterParams, sortBy, order);
	const start = (page - 1) * IMAGE_PAGE_SIZE;
	return users.slice(start, start + IMAGE_PAGE_SIZE).map(mapUser);
}

async function getUserCount(filterParams: ParameterType = {}) {
	const users = await getFilteredUsers(filterParams);
	return users.length;
}

async function updateUser(id: string, formData: FormData) {
	const token = await getKindeToken();

	const data = getFormUser(formData);

	await fetch(`${kindeIssuerUrl}/api/v1/user?id=${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(data),
	});
}

export {
	getFilteredUsers,
	getKindeToken,
	getUserCount,
	getUsers,
	getUsersPage,
	kindeIssuerUrl,
	mapUser,
	updateUser,
};
