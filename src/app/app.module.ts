import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/log-in/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http'; 
import { ImaskCEPDirective } from '../directives/imask.cep.directive';
import { ImaskTelDirective } from '../directives/imask.tel.directive ';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './routesProtection/auth-guard';
import { NavbarComponent } from './pages/components/navbar/navbar.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ImaskCEPDirective,
    ImaskTelDirective,
    HomeComponent,
    NavbarComponent,
    MyProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
