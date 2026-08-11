"use server";

import type { User } from "@/lib/types";
import {
	getAllUsers,
	getKindeToken,
	kindeIssuerUrl,
} from "@/queries/UserQueries";

function getFormUser(formData: FormData) {
	const picture = formData.get("picture") as string;
	const first_name = formData.get("first_name") as string;
	const last_name = formData.get("last_name") as string;
	const is_suspended = formData.get("is_suspended") as string;
	return { picture, first_name, last_name, is_suspended };
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

	if (!res.ok) {
		if (res.status === 404) return null;
		const errorBody = await res.text();
		console.error("Error fetching Kinde user:", errorBody);
		throw new Error("Failed to fetch user from Kinde");
	}

	const user = await res.json();
	console.log(user.picture);
	return {
		id: user.id,
		picture: user.picture,
		email: user.preferred_email,
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

async function updateUser(id: string, formData: FormData) {
	const token = await getKindeToken();
	const { picture, first_name, last_name, is_suspended } =
		getFormUser(formData);

	const res = await fetch(`${kindeIssuerUrl}/api/v1/user?id=${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			picture,
			given_name: first_name,
			family_name: last_name,
			is_suspended,
		}),
	});

	if (!res.ok) {
		const errorBody = await res.text();
		console.error("Error updating Kinde user:", errorBody);
		throw new Error("Failed to update user in Kinde");
	}
}

async function deleteUser(id: string) {
	try {
		const token = await getKindeToken();

		const res = await fetch(`${kindeIssuerUrl}/api/v1/user?id=${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			},
		});

		if (!res.ok) {
			const errorBody = await res.text();
			console.error("Error deleting Kinde user:", errorBody);
			throw new Error("Failed to delete user in Kinde");
		}
	} catch (error) {
		console.error("Error deleting Kinde user:", error);
	}
}

async function getUsersOptions() {
	const users = await getAllUsers();

	return users.map((u: User) => ({
		value: u.id,
		label: `${u.id} - ${u.email || u.first_name} ${u.last_name}`,
	}));
}

export { deleteUser, getUserById, getUsersOptions, updateUser };
