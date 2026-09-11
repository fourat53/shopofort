import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { type NextRequest, NextResponse } from "next/server";

type ExtendedRequest = NextRequest & {
	kindeAuth: {
		getPermissions: () => Promise<{
			permissions: string[];
		}>;
	};
};

export default withAuth(
	async function proxy(req: ExtendedRequest) {
		if (req.nextUrl.pathname.startsWith("/admin")) {
			const permissions = await req.kindeAuth.getPermissions();

			const isAdmin =
				permissions?.permissions.includes("ADMIN_ACCESS") ?? false;

			if (!isAdmin) {
				return NextResponse.redirect(new URL("/", req.url));
			}
		}
	},
	{ publicPaths: ["/", "/colors", "/api/uploadthing"] },
);

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
	],
};
