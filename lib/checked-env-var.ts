function checkedEnvVar(variable: string) {
	if (!process.env[variable]) {
		throw new Error(`\n❌ Missing environment variable: ${variable}`);
	}
	return process.env[variable];
}

export { checkedEnvVar };
