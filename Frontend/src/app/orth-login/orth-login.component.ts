import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orth-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './orth-login.component.html',
  styleUrl: './orth-login.component.css'
})
export class OrthLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  private router = inject(Router);
  private readonly PASSKEY_PROMPTED = 'passkeyPrompted';

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginObj = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.http.post('https://webauthn.local:8443/login', loginObj, { withCredentials: true, responseType: 'json' })
    .subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.username) {
          localStorage.setItem('username', res.username);

          this.http.get(`https://webauthn.local:8443/checkPasskeyRegistration?username=${res.username}`, { withCredentials: true })
            .subscribe((checkRes: any) => {
              if (checkRes.registered) {
                this.router.navigateByUrl('/welcome');
              } 
              else {
                if (this.hasPromptedForPasskey(res.username)) {
                  this.router.navigateByUrl('/welcome');
                } else {
                  this.addUsernameToPromptedSet(res.username);
                  this.router.navigateByUrl('/ask-passkey');
                }                
              }
            });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }

  addUsernameToPromptedSet(username: string) {
    const promptedSet = new Set(JSON.parse(localStorage.getItem(this.PASSKEY_PROMPTED) || '[]'));
    promptedSet.add(username);
    localStorage.setItem(this.PASSKEY_PROMPTED, JSON.stringify(Array.from(promptedSet)));
  }
  
  hasPromptedForPasskey(username: string): boolean {
    const promptedSet = new Set(JSON.parse(localStorage.getItem(this.PASSKEY_PROMPTED) || '[]'));
    return promptedSet.has(username);
  }
}
