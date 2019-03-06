import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAccessComponent } from './no-access/no-access.component';
import { AuthGuard } from './services/auth-guard.service';
import { AdminAuthGuard } from './services/admin-auth-guard.service';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { NgoDetailComponent } from './ngo-detail/ngo-detail.component';

const routes: Routes = [
	{ path: 'admin', component: AdminComponent, canActivate: [ AuthGuard, AdminAuthGuard ] },
	{ path: 'login', component: LoginComponent },
	{ path: 'ngos/:id/edit', component: NgoDetailComponent },
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'no-access', component: NoAccessComponent, pathMatch: 'full' }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
