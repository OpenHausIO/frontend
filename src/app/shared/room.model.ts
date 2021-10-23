export class Room {
	public readonly number: number | null;
	public readonly floor: number | null;
	public readonly icon: string | null;
	public readonly timestamps: { created: number, updated: number | null } | null;

	constructor(
		public readonly _id: string,
		public readonly name: string,
		number: number | null = null,
		floor: number | null = null,
		icon: string | null = null,
		timestamps: { created: number, updated: number | null } | null = null
	) { 
		this.number = number;
		this.floor = floor;
		this.icon = icon;
		this.timestamps = timestamps;
	}
}