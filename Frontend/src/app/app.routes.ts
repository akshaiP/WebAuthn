import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'register', 
        pathMatch: 'full' 
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
