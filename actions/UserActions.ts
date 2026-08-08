// "use server";

// import { updateTag } from "next/cache";
// import { Role } from "@/lib/generated/prisma/client";
// import { prisma } from "@/lib/prisma";

// function getFormUser(formData: FormData) {
// 	const firstName = formData.get("firstName") as string;
// 	const lastName = formData.get("lastName") as string;
// 	const email = formData.get("email") as string;
// 	const role = (formData.get("role") as Role) || "USER";
// 	return { firstName, lastName, email, role };
// }

// async function createUser(formData: FormData) {
// 	await prisma.user.create({
// 		data: getFormUser(formData),
// 	});
// 	updateTag("users");
// }

// async function updateUser(id: number, formData: FormData) {
// 	await prisma.user.update({
// 		where: { id },
// 		data: getFormUser(formData),
// 	});
// 	updateTag("users");
// }

// async function getUsersOptions() {
// 	const users = await prisma.user.findMany({
// 		select: { id: true, email: true },
// 		orderBy: { id: "asc" },
// 	});
// 	return users.map((u) => ({
// 		value: String(u.id),
// 		label: `${u.id} - ${u.email}`,
// 	}));
// }

// type KindeAuthUser = {
// 	id?: string;
// 	email?: string | null;
// 	given_name?: string | null;
// 	family_name?: string | null;
// 	picture?: string | null;
// };

// async function syncKindeUserToSupabase(user: KindeAuthUser) {
// 	if (!user?.email) {
// 		return null;
// 	}

// 	const email = user.email.trim().toLowerCase();
// 	const firstName = user.given_name?.trim() || null;
// 	const lastName = user.family_name?.trim() || null;

// 	return prisma.user.upsert({
// 		where: { email },
// 		create: {
// 			email,
// 			kindeId: user.id ?? null,
// 			firstName,
// 			lastName,
// 			givenName: firstName,
// 			familyName: lastName,
// 			emailVerified: true,
// 			picture: user.picture ?? null,
// 			role: Role.USER,
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		},
// 		update: {
// 			kindeId: user.id ?? undefined,
// 			firstName,
// 			lastName,
// 			givenName: firstName,
// 			familyName: lastName,
// 			emailVerified: true,
// 			picture: user.picture ?? null,
// 			updatedAt: new Date(),
// 		},
// 	});
// }

// export { createUser, getUsersOptions, syncKindeUserToSupabase, updateUser };
