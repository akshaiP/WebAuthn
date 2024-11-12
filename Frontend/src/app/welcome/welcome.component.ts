import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [HttpClientModule,ToastrModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  welcomeMessage: string = '';

  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getWelcomeMessage();
  }

  getWelcomeMessage() {
    this.http.get('https://webauthn.local:8443/api/welcome', { responseType: 'text', withCredentials: true })
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
    this.http.post('https://webauthn.local:8443/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          console.log('Logout successful');
          localStorage.removeItem("username");
          this.toastr.info('You have been logged out.', 'Logout');
          this.router.navigate(['/login']);  
        },
        error: (error) => {
          console.error('Logout failed', error);
          this.toastr.error('Failed to log out. Please try again.', 'Error');
        }
      });
  }

  registerPasskey(){
    this.router.navigate(['/ask-passkey']);
  }

  trustedDevices(){
    this.router.navigate(['/devices']);
  }
}
