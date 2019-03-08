import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-google-map',
	templateUrl: './google-map.component.html',
	styleUrls: [ './google-map.component.scss' ]
})
export class GoogleMapComponent implements OnInit {
	@Input('lat') lat: string;
	@Input('lng') lng: string;

	// title: string = 'My first AGM project';
	// lat: number = 51.678418;
	// lng: number = 7.809007;

	constructor() {}

	ngOnInit() {}
}
