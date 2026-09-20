import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { type NextRequest, NextResponse } from "next/server";

type ExtendedRequest = NextRequest & {
	kindeAuth: { token: { permissions: string[] } };
};

export default withAuth(
	async function proxy(req: ExtendedRequest) {
		const isAdmin = req.kindeAuth.token.permissions.includes("ADMIN_ACCESS");
		if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		return NextResponse.next();
	},
	{ isReturnToCurrentPage: true },
);

export const config = {
	matcher: ["/admin/:path*", "/cart"],
};
