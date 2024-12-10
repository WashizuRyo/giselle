import * as Tabs from "@radix-ui/react-tabs";
import { getDownloadUrl, head } from "@vercel/blob";
import {
	DownloadIcon,
	GithubIcon,
	HammerIcon,
	ListTreeIcon,
	XIcon,
} from "lucide-react";
import {
	type ComponentProps,
	type ReactNode,
	createContext,
	useContext,
	useMemo,
	useState,
} from "react";
import { LayersIcon } from "../../beta-proto/components/icons/layers";
import { useAgentName } from "../contexts/agent-name";
import { useDeveloperMode } from "../contexts/developer-mode";
import { useGraph } from "../contexts/graph";

function TabsTrigger(
	props: Omit<ComponentProps<typeof Tabs.Trigger>, "className">,
) {
	return (
		<Tabs.Trigger
			className="w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-[hsla(30,100%,98%,0.2)] data-[state=active]:bg-black-80"
			{...props}
		/>
	);
}

function TabsContent(
	props: Omit<ComponentProps<typeof Tabs.Content>, "className">,
) {
	return (
		<Tabs.Content
			className="absolute w-[400px] rounded-[24px] bg-[hsla(234,91%,5%,0.8)] overflow-hidden shadow-[0px_0px_3px_0px_hsla(0,_0%,_100%,_0.25)_inset] top-[0px] bottom-[20px] left-[84px] mt-[60px] backdrop-blur-[16px]"
			{...props}
		/>
	);
}

const TabValueContext = createContext<
	| {
			tabValue: string;
			setTabValue: (value: string) => void;
	  }
	| undefined
>(undefined);

export const useTabValue = () => {
	const context = useContext(TabValueContext);
	if (!context) {
		throw new Error("useTabValue must be used within a TabValueProvider");
	}
	return context;
};

export function NavigationPanel() {
	const [tabValue, setTabValue] = useState("");
	const developerMode = useDeveloperMode();
	return (
		<TabValueContext value={{ tabValue, setTabValue }}>
			<Tabs.Root
				orientation="vertical"
				value={tabValue}
				onValueChange={(value) => setTabValue(value)}
			>
				<Tabs.List className="absolute w-[54px] rounded-full bg-[hsla(233,93%,5%,0.8)] px-[4px] py-[8px] overflow-hidden shadow-[0px_0px_3px_0px_hsla(0,_0%,_100%,_0.25)_inset] top-[0px] left-[20px] mt-[60px] grid justify-center gap-[4px]">
					<TabsTrigger value="overview">
						<LayersIcon className="w-[18px] h-[18px] fill-black-30" />
					</TabsTrigger>
					{/* <TabsTrigger value="github">
					<GithubIcon className="w-[18px] h-[18px] stroke-black-30" />
				</TabsTrigger> */}
					<TabsTrigger value="structure">
						<ListTreeIcon className="w-[18px] h-[18px] stroke-black-30" />
					</TabsTrigger>

					{developerMode && (
						<TabsTrigger value="developer">
							<HammerIcon className="w-[18px] h-[18px] stroke-black-30" />
						</TabsTrigger>
					)}
				</Tabs.List>
				<TabsContent value="overview">
					<Overview />
				</TabsContent>
				{/* <TabsContent value="github">
				<GitHubIntegration />
			</TabsContent> */}
				<TabsContent value="structure">
					<Structure />
				</TabsContent>
				<TabsContent value="developer">
					<Developer />
				</TabsContent>
			</Tabs.Root>
		</TabValueContext>
	);
}

function ContentPanel({ children }: { children: ReactNode }) {
	return <div className="grid gap-[24px] px-[24px] py-[24px]">{children}</div>;
}
function ContentPanelHeader({
	children,
}: {
	children: ReactNode;
}) {
	const { setTabValue } = useTabValue();
	return (
		<header className="flex justify-between">
			<p
				className="text-[22px] font-rosart text-black--30"
				style={{ textShadow: "0px 0px 20px hsla(207, 100%, 48%, 1)" }}
			>
				{children}
			</p>
			<button type="button" onClick={() => setTabValue("")}>
				<XIcon className="w-[16px] h-[16px] text-black-30" />
			</button>
		</header>
	);
}

export function Overview() {
	const [editTitle, setEditTitle] = useState(false);
	const { agentName, updateAgentName } = useAgentName();
	return (
		<ContentPanel>
			<ContentPanelHeader>Overview</ContentPanelHeader>

			{editTitle ? (
				<input
					type="text"
					className="text-[16px] text-black-30 p-[4px] text-left outline-black-70 rounded-[8px]"
					defaultValue={agentName ?? "Untitled Agent"}
					ref={(ref) => {
						if (ref === null) {
							return;
						}
						async function update() {
							if (ref === null) {
								return;
							}
							setEditTitle(false);
							await updateAgentName(ref.value);
						}
						ref.focus();
						ref.select();
						ref.addEventListener("blur", update);
						ref.addEventListener("keydown", (e) => {
							if (e.key === "Enter") {
								update();
							}
						});
						return () => {
							ref.removeEventListener("blur", update);
							ref.removeEventListener("keydown", update);
						};
					}}
				/>
			) : (
				<button
					type="button"
					onClick={() => setEditTitle(true)}
					className="text-[16px] text-black-30 p-[4px] text-left"
				>
					{agentName}
				</button>
			)}
		</ContentPanel>
	);
}

function GitHubIntegration() {
	return <div>GitHub Integration</div>;
}

function Developer() {
	const { graphUrl } = useGraph();
	return (
		<ContentPanel>
			<ContentPanelHeader>Developer tools</ContentPanelHeader>
			<div className="flex flex-col gap-[8px]">
				<div>
					<a
						href={getDownloadUrl(graphUrl)}
						className="text-black-30 hover:text-black--30 flex items-center gap-[6px]"
					>
						<DownloadIcon className="w-[16px] h-[16px]" />
						Download the graph
					</a>
				</div>
			</div>
		</ContentPanel>
	);
}

export function Structure() {
	const { graph } = useGraph();
	const subGraphs = useMemo(
		() =>
			graph.subGraphs.map((subGraph) => ({
				...subGraph,
				nodes: subGraph.nodes
					.map((nodeId) => graph.nodes.find((node) => node.id === nodeId))
					.filter((node) => node !== undefined),
			})),
		[graph],
	);
	return (
		<ContentPanel>
			<ContentPanelHeader>Structure</ContentPanelHeader>
			<div className="flex flex-col gap-[8px]">
				{subGraphs.map((subGraph) => (
					<div key={subGraph.id}>
						<p className="text-[14px]">{subGraph.name}</p>
						<div className="pl-[8px] flex flex-col gap-[4px]">
							{subGraph.nodes.map((node) => node.name)}
						</div>
					</div>
				))}
			</div>
		</ContentPanel>
	);
}
