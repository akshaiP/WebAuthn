import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  welcomeMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getWelcomeMessage();
  }

  getWelcomeMessage() {
    this.http.get('http://localhost:8080/api/welcome', { responseType: 'text', withCredentials: true })
      .subscribe({
        next: (message: string) => {
          this.welcomeMessage = message;
          console.log('Message received:', message);
        },
        error: (error) => {
          console.error('Failed to get the welcome message', error);
        }
      });
  }

  logout() {
    this.http.post('http://localhost:8080/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          console.log('Logout successful');
          localStorage.clear();
          this.router.navigate(['/ologin']);  
        },
        error: (error) => {
          console.error('Logout failed', error);
        }
      });
  }
}
