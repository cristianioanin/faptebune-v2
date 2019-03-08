import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAccessComponent } from './no-access/no-access.component';
import { AuthGuard } from './services/auth-guard.service';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { NgoDetailComponent } from './ngo-detail/ngo-detail.component';
import { NgoFormComponent } from './ngo-form/ngo-form.component';

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'admin', component: AdminComponent, canActivate: [ AuthGuard, AdminAuthGuard ] },
	{ path: 'login', component: LoginComponent },
	{ path: 'ngos/new', component: NgoFormComponent, pathMatch: 'full' },
	{ path: 'ngos/:id', component: NgoDetailComponent },
	{ path: 'no-access', component: NoAccessComponent, pathMatch: 'full' }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
