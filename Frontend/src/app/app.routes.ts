import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';

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
        path: 'register', 
        component: RegisterComponent 
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
