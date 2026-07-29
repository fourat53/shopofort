import styles from "@/components/loaders/global-loader/global-loader.module.css";

export default function GlobalLoader() {
	return (
		<div id="global-loader" className={styles.container}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	);
}
