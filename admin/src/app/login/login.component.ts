import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthService as SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
	invalidLogin: boolean;
	private user: SocialUser;
	private loggedIn: boolean;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authService: AuthService,
		private socialAuth: SocialAuthService
	) {}

	ngOnInit() {
		this.socialAuth.authState.subscribe((user) => {
			this.user = user;
			this.loggedIn = user != null;
		});
	}

	signIn(credentials) {
		this.authService.login(credentials).subscribe((result) => {
			if (result) {
				let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
				this.router.navigate([ returnUrl || '/admin' ]);
			} else {
				this.invalidLogin = true;
			}
		});
	}

	signInWithGoogle(): void {
		this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID);
	}

	signInWithFB(): void {
		this.socialAuth.signIn(FacebookLoginProvider.PROVIDER_ID).then((response) => {
			const access_token = {
				access_token: response.authToken
			};
			this.authService.facebookLogin(access_token).subscribe((result) => {
				if (result) {
					let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
					this.router.navigate([ returnUrl || '/admin' ]);
				} else {
					this.invalidLogin = true;
				}
			});
		});
	}

	signOut(): void {
		this.socialAuth.signOut();
	}
}
