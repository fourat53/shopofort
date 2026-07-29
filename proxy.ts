import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { syncKindeUserToSupabase } from "./actions/UserActions";

export default withAuth(
	async function proxy(
		req: Request & {
			kindeAuth?: {
				user?: {
					id?: string;
					email?: string;
					given_name?: string;
					family_name?: string;
					picture?: string;
				};
			};
		},
	) {
		if (req.kindeAuth?.user?.email) {
			await syncKindeUserToSupabase(req.kindeAuth.user);
		}
	},
	{
		publicPaths: ["/admin", "/colors"],
	},
);

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
	],
};
