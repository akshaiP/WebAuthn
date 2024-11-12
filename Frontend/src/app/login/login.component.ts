import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component,inject } from '@angular/core';
import { base64urlToUint8array, uint8arrayToBase64url } from '../Utils/utils';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule,
    ToastrModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';

  private router = inject(Router);

  constructor(private HttpServ:HttpClient,private toastr: ToastrService) {
  }

  signUpClick(){
    this.router.navigateByUrl("/signup");
  }

  normalLoginClick(){
    this.router.navigateByUrl("/normal-login");
  }

  login() {
    const formData = new FormData();
    formData.append('username', this.username);

    this.HttpServ.post("https://webauthn.local:8443/webauthn/login", formData , { withCredentials: true })
      .subscribe((credentialGetJson: any) => {
        const publicKey = {
          ...credentialGetJson.publicKey,
          allowCredentials: credentialGetJson.publicKey.allowCredentials.map((credential: any) => ({
            ...credential,
            id: base64urlToUint8array(credential.id)
          })),
          challenge: base64urlToUint8array(credentialGetJson.publicKey.challenge),
          extensions: credentialGetJson.publicKey.extensions
        };

        navigator.credentials.get({ publicKey })
          .then((publicKeyCredential: any) => {
            const encodedResult = {
              type: publicKeyCredential.type,
              id: publicKeyCredential.id,
              response: {
                authenticatorData: uint8arrayToBase64url(publicKeyCredential.response.authenticatorData),
                clientDataJSON: uint8arrayToBase64url(publicKeyCredential.response.clientDataJSON),
                signature: uint8arrayToBase64url(publicKeyCredential.response.signature),
                userHandle: publicKeyCredential.response.userHandle ? uint8arrayToBase64url(publicKeyCredential.response.userHandle) : null
              },
              clientExtensionResults: publicKeyCredential.getClientExtensionResults()
            };

            const loginFormData = new FormData();
            loginFormData.append('credential', JSON.stringify(encodedResult));
            loginFormData.append('username', this.username);

            this.HttpServ.post<WebauthnLoginResponse<any>>("https://webauthn.local:8443/webauthn/finish-login", loginFormData, { withCredentials: true })
            .subscribe({
                next: (response: any) => {
                  if (response.status === 'success') {
                    localStorage.setItem('username',this.username);
                    this.router.navigateByUrl("/welcome");
                    this.toastr.success('Login successful', 'Welcome!');
                    console.log("Logged in");
                  } else {
                    console.error('Login failed:', response.message);
                    this.toastr.error(`Login failed: ${response.message}`, 'Error');
                  }
                },
                error: (error) => {
                  console.error('Error during login:', error);
                  this.toastr.error('Error during login. Please try again.', 'Login Error');
                }
              });
          })
          .catch(error => {
            console.error('Error during WebAuthn login:', error);
            this.toastr.error('Passkey login failed. Please try again.', 'Error');
          });
      });
  }
}

interface WebauthnLoginResponse<T> {
  status: string;
  message: string; 
  data?: T; 
}
