import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component,inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  private router = inject(Router);

  constructor(private http: HttpClient, private fb: FormBuilder,private toastr: ToastrService) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER'] 
    });
  }

  signUp() {
    if (this.signupForm.invalid) {
      return;
    }

    const formData = this.signupForm.value;

    this.http.post("https://webauthn.local:8443/auth/signup", formData, { responseType: 'json' })
      .subscribe({
        next: (res: any) => {
          if (res.message === "User registered successfully") {
            this.toastr.success('Sign up successful!', 'Success');
            this.router.navigateByUrl('normal-login')
            .then(navigated => {
              console.log('Navigation successful:', navigated);
            }).catch(err => {
              console.error('Navigation error:', err);
            });
          } else {
            this.toastr.error(res.message, 'Sign Up Failed');
          }
        },
        error: (err: any) => {
          const errorMessage = err.error?.message || 'An error occurred. Please try again.';
          console.error('Error during registration:', err);
          this.toastr.error(errorMessage, 'Sign Up Error');
        }
      });
  }
}
