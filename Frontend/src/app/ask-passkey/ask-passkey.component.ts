import { Component } from '@angular/core';
import { base64urlToUint8array, uint8arrayToBase64url } from '../Utils/utils';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask-passkey',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './ask-passkey.component.html',
  styleUrl: './ask-passkey.component.css'
})
export class AskPasskeyComponent {

  username: string = localStorage.getItem('username') || ''; 

  constructor(private http: HttpClient, private router: Router) {}

  registerPasskey() {

    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('display', this.username);
    this.http.post("https://webauthn.local:8443/register",formData, { withCredentials: true })
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

        if (navigator.credentials && navigator.credentials.create) {
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

              this.finishPasskeyRegistration(encodedResult);
            })
            .catch(error => console.error('Error during passkey registration:', error));
        } else {
          console.error('WebAuthn API not supported in this browser.');
        }
      });
  }

  finishPasskeyRegistration(credentialResult: any) {
    const finishAuthFormData = new FormData();
    finishAuthFormData.append('credential', JSON.stringify(credentialResult));
    finishAuthFormData.append('username', this.username);
    finishAuthFormData.append('credname', this.username);

    this.http.post('https://webauthn.local:8443/finishauth', finishAuthFormData, { responseType: 'text', withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.setItem('webauthnRegistered', 'true');
          alert('Passkey registration successful!');
          this.router.navigateByUrl("/welcome");
        },
        error: (error) => console.error('Error during finish registration:', error)
      });
  }

  skipPasskey() {
    this.router.navigateByUrl("/welcome");
  }

}
