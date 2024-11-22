import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/log-in/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './routesProtection/auth-guard';
import { AuthIsLoggedGuard } from './routesProtection/auth-isLogged-guard';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
const routes: Routes = [
  { path: '', component: LoginComponent, canActivate :[AuthIsLoggedGuard] },
  { path: 'log-in', component: LoginComponent, canActivate :[AuthIsLoggedGuard] },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'my-profile', component: MyProfileComponent, canActivate :[AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
