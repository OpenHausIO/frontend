import { IconDefinition } from "@fortawesome/fontawesome-common-types";

export enum IconContainerType {
	Room,
	Device
}

export class IconContainerModel {
	constructor(
		public iconContainerType: IconContainerType,
		public icons: { icon: IconDefinition, name: String }[],
	) { }
}