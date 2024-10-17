import { Component } from '@angular/core';
import { WebauthnService } from '../Service/webauthn.service';
import { base64urlToUint8array, uint8arrayToBase64url } from '../Utils/utils';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';

  constructor(private webAuthnService: WebauthnService) {}

  login() {
    this.webAuthnService.startLogin(this.username)
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

            this.webAuthnService.finishLogin(encodedResult)
              .subscribe(response => {
                window.location.href = '/welcome';
              });
          })
          .catch(error => {
            console.error('Error during login:', error);
          });
      });
  }
}
