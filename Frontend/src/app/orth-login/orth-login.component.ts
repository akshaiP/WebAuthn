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

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    // Initialize the form with validators
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

    this.http.post("http://localhost:8080/api/login", loginObj)
    .subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.message === 'Login successful') {
          this.router.navigateByUrl('/welcome');
        } else {
          this.errorMessage = 'Invalid login credentials';
        }
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    );
  }
}
