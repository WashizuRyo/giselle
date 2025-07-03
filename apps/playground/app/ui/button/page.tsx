import { Button } from "@giselle-internal/ui/button";
import { DemoSection } from "../components/demo-section";
import { UiPage } from "../components/ui-page";

export default function () {
	return (
		<UiPage title="Button">
			<DemoSection label="Style">
				<Button>Subtle(default)</Button>
				<Button variant="filled">Filled</Button>
				<Button variant="solid">Solid</Button>
				<Button variant="glass">Glass</Button>
				<Button variant="outline">Outline</Button>
			</DemoSection>
			<DemoSection label="Size">
				<Button variant="glass">default</Button>
				<Button variant="glass" size="large">
					Large
				</Button>
			</DemoSection>
		</UiPage>
	);
}
