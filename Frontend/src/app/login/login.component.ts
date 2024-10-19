import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component,inject } from '@angular/core';
import { base64urlToUint8array, uint8arrayToBase64url } from '../Utils/utils';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';

  private router = inject(Router);

  constructor(private HttpServ:HttpClient) {}

  login() {
    const formData = new FormData();
    formData.append('username', this.username);
    this.HttpServ.post("http://localhost:8080/login", formData)
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

            const formData = new FormData();
            formData.append('credential', JSON.stringify(encodedResult));
            formData.append('username', this.username);

            this.HttpServ.post("http://localhost:8080/welcome", formData)
              .subscribe(response => {
                this.router.navigateByUrl("/welcome");
              });
          })
          .catch(error => {
            console.error('Error during login:', error);
          });
      });
  }
}
