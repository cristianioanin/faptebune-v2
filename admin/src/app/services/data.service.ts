import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BadInput } from '../shared/bad-input';
import { NotFoundError } from '../shared/not-found-error';
import { AppError } from '../shared/app-error';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	constructor(private url: string, private http: HttpClient) {}

	getAll() {
		return this.http.get(this.url).pipe(catchError(this.handleError));
	}

	create(resource) {
		return this.http
			.post(this.url, JSON.stringify(resource))
			.pipe(map((response) => response.valueOf()), catchError(this.handleError));
	}

	getOne(id) {
		return this.http.get(`${this.url}/${id}`).pipe(catchError(this.handleError));
	}

	update(resource) {
		return this.http
			.put(`${this.url}/${resource.id}`, JSON.stringify(resource))
			.pipe(map((response) => response.valueOf()), catchError(this.handleError));
	}

	delete(id) {
		return this.http.delete(`${this.url}/${id}`).pipe(catchError(this.handleError));
	}

	private handleError(error: HttpErrorResponse) {
		if (error.status === 400) {
			return throwError(new BadInput(error));
		} else if (error.status === 404) {
			return throwError(new NotFoundError());
		} else {
			return throwError(new AppError(error));
		}
	}
}
