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
  constructor(private http: HttpClient, private router: Router) {}


  logout() {
    this.http.post('http://localhost:8080/logout', {}, { withCredentials: true ,responseType: 'text' }).subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/ologin']);  
      },
      error: (error) => {
        console.error('Logout failed', error);
      }
    });
  }
}
