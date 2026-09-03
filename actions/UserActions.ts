import { unstable_cache, updateTag } from "next/cache";
import { filterUsers, mapUser } from "@/actions/UserFunctions";
import {
	CACHE_SECONDS,
	FILTER_CACHE_SECONDS,
	IMAGE_PAGE_SIZE,
} from "@/components/pagination/PaginationParams";
import { getFormUser } from "@/lib/entity/entity-form";
import type { ParameterType, User } from "@/lib/entity/types";
import { checkedEnvVar } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const kindeIssuerUrl = checkedEnvVar("KINDE_ISSUER_URL");

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

export {
	deleteUser,
	getUserById,
	getUserCount,
	getUsers,
	getUsersPage,
	updateUser,
};
