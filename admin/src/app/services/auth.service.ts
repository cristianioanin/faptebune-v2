import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
	url: string = 'http://localhost:3000/users';
	storedToken: string = localStorage.getItem('faptebune_token');

	constructor(private jwtHelper: JwtHelperService, private http: HttpClient, private router: Router) {}

	login(credentials) {
		return this.http.post<any>(`${this.url}/login`, credentials).pipe(
			map((response) => {
				if (response) {
					localStorage.setItem('faptebune_token', response.token);
					return true;
				}
				return false;
			}),
			catchError(this.handleError)
		);
	}

	facebookLogin(accessToken) {
		return this.http.post<any>(`${this.url}/auth/facebook`, accessToken).pipe(
			map((response) => {
				if (response) {
					localStorage.setItem('faptebune_token', response.token);
					return true;
				}
				return false;
			}),
			catchError(this.handleError)
		);
	}

	logout() {
		localStorage.removeItem('faptebune_token');
		this.router.navigate([ '/' ]);
	}

	isLoggedIn() {
		return !this.jwtHelper.isTokenExpired(this.storedToken);
	}

	get currentUser() {
		if (!this.storedToken) return null;
		return this.jwtHelper.decodeToken(this.storedToken);
	}

	getToken() {
		return this.storedToken;
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			console.error('App error occurred:', error.error.message);
		} else {
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
		}
		return throwError('Something bad happened; unknown error...');
	}
}
