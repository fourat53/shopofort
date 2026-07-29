"use client";

import { KindeProvider as KindeAuthProvider } from "@kinde-oss/kinde-auth-nextjs";

export const KindeProvider = ({ children }: { children: React.ReactNode }) => {
	return <KindeAuthProvider>{children}</KindeAuthProvider>;
};
