import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
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

    console.log(this.loginForm.value);
    this.http.post('http://localhost:8080/login', loginObj, { withCredentials: true, responseType: 'json' })
    .subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.username) {
           localStorage.setItem('username', res.username); 
          this.router.navigateByUrl('/ask-passkey');
          console.log("logged in");
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }
}
