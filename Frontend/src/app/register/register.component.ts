import { Component } from '@angular/core';
import { WebauthnService } from '../Service/webauthn.service';
import { base64urlToUint8array,uint8arrayToBase64url } from '../Utils/utils';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  display: string = '';
  credname: string = '';

  constructor(private webAuthnService: WebauthnService) {}

  register() {
    this.webAuthnService.startRegistration(this.username, this.display)
      .subscribe((credentialCreateJson: any) => {
        const publicKey = {
          ...credentialCreateJson.publicKey,
          challenge: base64urlToUint8array(credentialCreateJson.publicKey.challenge),
          user: {
            ...credentialCreateJson.publicKey.user,
            id: base64urlToUint8array(credentialCreateJson.publicKey.user.id)
          },
          excludeCredentials: credentialCreateJson.publicKey.excludeCredentials.map((credential: any) => ({
            ...credential,
            id: base64urlToUint8array(credential.id)
          })),
          extensions: credentialCreateJson.publicKey.extensions
        };

        navigator.credentials.create({ publicKey })
          .then((publicKeyCredential: any) => {
            const encodedResult = {
              type: publicKeyCredential.type,
              id: publicKeyCredential.id,
              response: {
                attestationObject: uint8arrayToBase64url(publicKeyCredential.response.attestationObject),
                clientDataJSON: uint8arrayToBase64url(publicKeyCredential.response.clientDataJSON),
                transports: publicKeyCredential.response.getTransports ? publicKeyCredential.response.getTransports() : []
              },
              clientExtensionResults: publicKeyCredential.getClientExtensionResults()
            };

            this.webAuthnService.finishRegistration(encodedResult)
              .subscribe(response => {
                window.location.href = '/login';
              });
          })
          .catch(error => {
            console.error('Error during registration:', error);
          });
      });
  }
}
