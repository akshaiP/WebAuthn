import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {
  constructor(private http: HttpClient) { }

  startRegistration(username: string, display: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('display', display);

    return this.http.post('webauthn.local:8443/registerauth', formData);
  }

  finishRegistration(credential: any): Observable<any> {
    const formData = new FormData();
    formData.append('credential', JSON.stringify(credential));

    return this.http.post('webauthn.local:8443/finishauth', formData);
  }

  startLogin(username: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', username);

    return this.http.post('webauthn.local:8443/login', formData);
  }

  finishLogin(credential: any): Observable<any> {
    const formData = new FormData();
    formData.append('credential', JSON.stringify(credential));

    return this.http.post('webauthn.local:8443/welcome', formData);
  }
}
