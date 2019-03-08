import { Component, OnInit, Input } from '@angular/core';
import { NgoService } from '../services/ngo.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { AuthorInterface } from '../shared/interfaces';
import { DonationService } from '../services/donation.service';

@Component({
	selector: 'app-ngo-detail',
	templateUrl: './ngo-detail.component.html',
	styleUrls: [ './ngo-detail.component.scss' ]
})
export class NgoDetailComponent implements OnInit {
	currentNgo: any;
	createdBy: AuthorInterface;

	constructor(private service: NgoService, private route: ActivatedRoute, private donationService: DonationService) {}

	ngOnInit() {
		let id: string;
		this.route.params.subscribe((params) => {
			id = params.id;
		});
		this.service.getOne(id).subscribe((ngo) => {
			this.currentNgo = ngo;
			let author = this.currentNgo.author[0];
			let authMethod = author.authMethod;

			this.createdBy = {
				name: author[authMethod].username,
				email: author[authMethod].email,
				avatar: author[authMethod].avatar
			};
		});
	}

	deleteDonation(id) {
		this.donationService.delete(id).subscribe((donation) => {
			let index = this.currentNgo.donations.findIndex((elem) => elem['_id'] === id);
			console.log(index);
			this.currentNgo.donations.splice(index, 1);
			this.currentNgo.amountRaised -= donation['amount'];
		});
	}
}
