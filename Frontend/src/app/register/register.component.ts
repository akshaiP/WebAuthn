import { Component,inject } from '@angular/core';
import { base64urlToUint8array,uint8arrayToBase64url } from '../Utils/utils';
import { FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule
  ],
  providers:[HttpClient],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  // private http = inject(HttpClient);
  private router = inject(Router);

  registerObj:any = {
    username:'',
    display:''
  }
  credname: string = '';

  constructor(private HttpServ:HttpClient) {}

  register() {
    const formData = new FormData();
    formData.append('username', this.registerObj.username);
    formData.append('display', this.registerObj.display);

    this.HttpServ.post("http://localhost:8080/register", formData)
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

        if (!navigator.credentials || !navigator.credentials.create) {
          console.error("WebAuthn API is not supported in this browser.");
          return;
        }

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

            const finishAuthFormData = new FormData();
            finishAuthFormData.append('credential', JSON.stringify(encodedResult));
            finishAuthFormData.append('username', this.registerObj.username);
            finishAuthFormData.append('credname', this.credname);

            this.HttpServ.post('http://localhost:8080/finishauth', finishAuthFormData, { responseType: 'text' })
            .subscribe({
              next: (response: any) => {
                console.log('Finish registration response:', response);
                this.router.navigateByUrl("/login");
              },
              error: (error) => {
                console.error('Error during finish registration:', error);
              }
            });
          })
          .catch(error => {
            console.error('Error during registration:', error);
          });
      });
  }
}
