import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/components/data-table/PaginationParams";
import { checkedEnvVar } from "@/lib/checked-env-var";
import { CACHE_REVALIDATE_SECONDS } from "@/lib/prisma";
import type { User } from "@/lib/types";

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
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params,
		cache: "no-store",
	});

	if (!res.ok) {
		const errorBody = await res.text();
		console.error("Kinde M2M Auth Error:", errorBody);
		throw new Error(`Failed to authenticate with Kinde API: ${errorBody}`);
	}

	const data = await res.json();
	return data.access_token;
}

async function fetchAllKindeUsers() {
	const token = await getKindeToken();
	let allUsers: User[] = [];
	let nextToken: string | null = null;
	let hasMore = true;

	while (hasMore) {
		const url = new URL(`${kindeIssuerUrl}/api/v1/users`);
		if (nextToken) url.searchParams.append("next_token", nextToken);

		const res = await fetch(url.toString(), {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			},
		});

		if (!res.ok) {
			const errorBody = await res.text();
			console.error("Kinde M2M Auth Error:", errorBody);
			throw new Error(`Failed to authenticate with Kinde API: ${errorBody}`);
		}
		const data = await res.json();
		if (data.users) {
			allUsers = [...allUsers, ...data.users];
		}

		if (data.next_token) {
			nextToken = data.next_token;
		} else {
			hasMore = false;
		}
	}

	return allUsers;
}

const getAllUsersCached = unstable_cache(
	async () => fetchAllKindeUsers(),
	["all-kinde-users"],
	{
		revalidate: CACHE_REVALIDATE_SECONDS,
		tags: ["users"],
	},
);

async function getUserCount() {
	const users = await getAllUsersCached();
	return users.length;
}

async function getUsersPage(page: number) {
	const allUsers = await getAllUsersCached();

	const paginatedUsers = allUsers.slice(
		(page - 1) * PAGE_SIZE,
		page * PAGE_SIZE,
	);

	return paginatedUsers.map((user) => ({
		id: user.id,
		picture: user.picture,
		first_name: user.first_name,
		last_name: user.last_name,
		username: user.email?.split("@")[0],
		email: user.email,
		is_suspended: user.is_suspended,
		total_sign_ins: user.total_sign_ins,
		failed_sign_ins: user.failed_sign_ins,
		last_signed_in: user.last_signed_in,
		created_on: user.created_on,
		updated_on: user.created_on,
	}));
}

export { getUserCount, getUsersPage };
