import { JwtModule } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatComponentsModule } from './mat-components/mat-components.module';
import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { AgmCoreModule } from '@agm/core';
import { NoAccessComponent } from './no-access/no-access.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { NgosComponent } from './ngos/ngos.component';
import { NgoDetailComponent } from './ngo-detail/ngo-detail.component';
import { TextClipPipe } from './shared/text-clip.pipe';
import { GoogleMapComponent } from './google-map/google-map.component';
import { NgoFormComponent } from './ngo-form/ngo-form.component';

const fbLoginOptions: LoginOpt = {
	scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
	return_scopes: true,
	enable_profile_selector: true
};

const googleLoginOptions: LoginOpt = {
	scope: 'profile email'
};

let config = new AuthServiceConfig([
	{
		id: GoogleLoginProvider.PROVIDER_ID,
		provider:
			new GoogleLoginProvider(
				'***GOOGLE_CLIENT_ID***',
				googleLoginOptions
			)
	},
	{
		id: FacebookLoginProvider.PROVIDER_ID,
		provider: new FacebookLoginProvider('***FACEBOOK_CLIENT_ID***', fbLoginOptions)
	}
]);

export function provideConfig() {
	return config;
}
@NgModule({
	declarations:
		[
			AppComponent,
			NoAccessComponent,
			AdminComponent,
			LoginComponent,
			NavbarComponent,
			NgosComponent,
			NgoDetailComponent,
			TextClipPipe,
			GoogleMapComponent,
			NgoFormComponent
		],
	imports:
		[
			BrowserModule,
			AppRoutingModule,
			BrowserAnimationsModule,
			MatComponentsModule,
			HttpClientModule,
			FormsModule,
			JwtModule.forRoot({
				config:
					{
						tokenGetter:
							function tokenGetter() {
								return localStorage.getItem('faptebune_token');
							},
						whitelistedDomains: [ 'localhost:3000', 'localhost:4200' ],
						blacklistedRoutes: [ 'http://localhost:3000/users/login', 'http://localhost:4200/auth/login' ]
					}
			}),
			SocialLoginModule,
			AgmCoreModule.forRoot({
				apiKey: '***GOOGLE_MAPS_APIKEY***'
			})
		],
	providers:
		[
			AuthService,
			AuthGuard,
			AdminAuthGuard,
			{
				provide: AuthServiceConfig,
				useFactory: provideConfig
			},
			{
				provide: HTTP_INTERCEPTORS,
				useClass: AuthInterceptor,
				multi: true
			}
		],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
