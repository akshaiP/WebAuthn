import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignupComponent } from './signup/signup.component';
import { OrthLoginComponent } from './orth-login/orth-login.component';
import { AskPasskeyComponent } from './ask-passkey/ask-passkey.component';
import { authGuard } from './authguard/auth.guard';
import { DeviceListComponent } from './device-list/device-list.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
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
        component: AskPasskeyComponent,
        canActivate: [authGuard] 
    },
    {
        path: 'devices', 
        component: DeviceListComponent,
        canActivate: [authGuard] 
    },
    {
        path: 'login', 
        component: LoginComponent
    },
    {
        path: 'welcome', 
        component: WelcomeComponent,
        canActivate: [authGuard] 
    }
];
