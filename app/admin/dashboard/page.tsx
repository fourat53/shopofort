import { updateCache } from "@/actions/EntityActions";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
	return (
		<div>
			<Button onClick={updateCache} className="w-60">
				Update cache
			</Button>
		</div>
	);
}
