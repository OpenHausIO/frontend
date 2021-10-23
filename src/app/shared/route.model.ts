import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export class Route {
	public active: boolean = false;

	constructor (
		public name: string,
		public icon: IconDefinition,
		public destination: string) 
	{ }
}