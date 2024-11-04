import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { OrthLoginComponent } from './orth-login/orth-login.component';
import { AskPasskeyComponent } from './ask-passkey/ask-passkey.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
    },
    {
        path: 'home', 
        component: HomeComponent 
    },
    {
        path: 'signup', 
        component: SignupComponent
    },
    {
        path: 'ologin', 
        component: OrthLoginComponent
    },
    {
        path: 'ask-passkey', 
        component: AskPasskeyComponent
    },
    {
        path: 'login', 
        component: LoginComponent
    },
    {
        path: 'welcome', 
        component: WelcomeComponent
    }
];
