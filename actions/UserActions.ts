import { unstable_cache } from "next/cache";
import {
	FILTER_CACHE_SECONDS,
	IMAGE_PAGE_SIZE,
} from "@/components/data-table/PaginationParams";
import { checkedEnvVar } from "@/lib/checked-env-var";
import type { PreferredUser, User } from "@/lib/entity/types";

const kindeIssuerUrl = checkedEnvVar("KINDE_ISSUER_URL");

type UserSearchParams = Record<string, string | string[] | undefined>;

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
	searchParams: UserSearchParams,
	name: string,
): string | undefined {
	const value = searchParams[name];

	return Array.isArray(value) ? value[0] : value;
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

function filterUsers(users: User[], searchParams: UserSearchParams): User[] {
	const id = getParam(searchParams, "id")?.toLowerCase();
	const email = getParam(searchParams, "email")?.toLowerCase();
	const firstName = getParam(searchParams, "first_name")?.toLowerCase();
	const lastName = getParam(searchParams, "last_name")?.toLowerCase();

	return users.filter((user) => {
		if (id && !user.id.toLowerCase().includes(id)) {
			return false;
		}

		if (email && !user.email?.toLowerCase().includes(email)) {
			return false;
		}

		if (firstName && !user.first_name?.toLowerCase().includes(firstName)) {
			return false;
		}

		if (lastName && !user.last_name?.toLowerCase().includes(lastName)) {
			return false;
		}

		return true;
	});
}

const getFilteredUsers = unstable_cache(
	async (searchParams: UserSearchParams) => {
		const users = await getUsers();
		return filterUsers(users, searchParams);
	},
	["kinde-filtered-users"],
	{ revalidate: FILTER_CACHE_SECONDS },
);

async function getUserCount(searchParams: UserSearchParams = {}) {
	const users = await getFilteredUsers(searchParams);

	return users.length;
}

async function getUsersPage(page: number, searchParams: UserSearchParams = {}) {
	const users = await getFilteredUsers(searchParams);

	const start = (page - 1) * IMAGE_PAGE_SIZE;

	return users.slice(start, start + IMAGE_PAGE_SIZE).map(mapUser);
}

export {
	getFilteredUsers,
	getKindeToken,
	getUserCount,
	getUsers,
	getUsersPage,
	kindeIssuerUrl,
	mapUser,
};
