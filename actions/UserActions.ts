"use server";

import { updateTag } from "next/cache";
import { Role } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

async function createUser(formData: FormData) {
	const firstName = formData.get("firstName") as string;
	const lastName = formData.get("lastName") as string;
	const email = formData.get("email") as string;
	const role = (formData.get("role") as Role) || "USER";

	await prisma.user.create({
		data: {
			firstName,
			lastName,
			email,
			role,
		},
	});

	updateTag("users");
}

async function getUsersOptions() {
	const users = await prisma.user.findMany({
		select: { id: true, email: true },
		orderBy: { id: "asc" },
	});
	return users.map((u) => ({
		value: String(u.id),
		label: `${u.id} - ${u.email}`,
	}));
}

type KindeAuthUser = {
	id?: string;
	email?: string | null;
	given_name?: string | null;
	family_name?: string | null;
	picture?: string | null;
};

async function syncKindeUserToSupabase(user: KindeAuthUser | null | undefined) {
	if (!user?.email) {
		return null;
	}

	const email = user.email.trim().toLowerCase();
	const firstName = user.given_name?.trim() || null;
	const lastName = user.family_name?.trim() || null;

	return prisma.user.upsert({
		where: { email },
		create: {
			email,
			kindeId: user.id ?? null,
			firstName,
			lastName,
			givenName: firstName,
			familyName: lastName,
			emailVerified: true,
			picture: user.picture ?? null,
			role: Role.USER,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		update: {
			kindeId: user.id ?? undefined,
			firstName,
			lastName,
			givenName: firstName,
			familyName: lastName,
			emailVerified: true,
			picture: user.picture ?? null,
			updatedAt: new Date(),
		},
	});
}

export { createUser, getUsersOptions, syncKindeUserToSupabase };
