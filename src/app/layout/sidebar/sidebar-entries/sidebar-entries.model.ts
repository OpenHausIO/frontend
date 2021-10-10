export class SidebarEntriesContainer {
	constructor(
		public describtion: string, 
		public entries: SidebarEntry[]) { }
}

export class SidebarEntry {
	public active: boolean = false;

	constructor (
		public name: string,
		public icon: string,
		public destination: string) { }
}