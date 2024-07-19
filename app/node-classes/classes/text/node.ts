import type { Port, Property } from "../../type";

export const name = "text";

export const label = "Text";

export const outputPorts: Port[] = [{ type: "data", label: "Text" }];

export const properties: Property[] = [{ name: "text", label: "Text" }];

const propertyPortMap = {
	text: "Text",
};
