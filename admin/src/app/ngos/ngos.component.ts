import { Component, OnInit, ViewChild } from '@angular/core';
import { NgoService } from '../services/ngo.service';
import { AppError } from '../shared/app-error';
import { NotFoundError } from '../shared/not-found-error';
import { BadInput } from '../shared/bad-input';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
	selector: 'app-ngos',
	templateUrl: './ngos.component.html',
	styleUrls: [ './ngos.component.scss' ]
})
export class NgosComponent implements OnInit {
	ngos: any[];
	displayedColumns: string[] = [ 'position', 'name', 'location', 'amountRaised', 'controls' ];
	dataSource;

	@ViewChild(MatSort) sort: MatSort;

	constructor(private service: NgoService) {}

	ngOnInit() {
		this.service.getAll().subscribe((ngos: Array<any>) => {
			this.ngos = ngos;
			this.dataSource = new MatTableDataSource(this.ngos);
			this.dataSource.sort = this.sort;
			console.log(this.dataSource);
		});
	}
}
