import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  role: string = 'USER'; 
  errorMessage: string = '';
  
  private router = inject(Router);

  constructor(private http:HttpClient) {}

  signUp() {
    const formData = {
      username: this.username,
      password: this.password,
      email: this.email,
      role: this.role
    };

    this.http.post("http://localhost:8080/api/signup", formData).subscribe({
      next: (response: any) => {
        console.log('Sign up successful', response);
        this.router.navigateByUrl("/login");
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = "Username is already taken!";
        } else if (err.error) { 
          this.errorMessage = err.error;
        } else {
          this.errorMessage = "Sign up failed. Please try again.";
        }
      }
    });
  }
}
