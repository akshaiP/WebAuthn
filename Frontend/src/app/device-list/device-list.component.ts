import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    ToastrModule
  ],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent implements OnInit{

  devices: Device[] = [];
  username: string = localStorage.getItem('username') || ''; 

  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadDevices();
  }


  loadDevices(): void {
    this.http.get<Device[]>(`https://webauthn.local:8443/devices?username=${this.username}`, {withCredentials:true}).subscribe({
      next: (devices) => {
        console.log('Devices loaded:', devices);
        this.devices = devices;
      },
      error: (error) => {
        console.error('Error loading devices', error);
        this.toastr.error('Failed to load devices. Please try again.', 'Error');
      }
    });
  }

  deleteDevice(id: number): void {
    if (confirm('Are you sure you want to remove this device?')) {
      this.http.delete(`https://webauthn.local:8443/device/${id}?username=${this.username}`, {withCredentials: true, responseType: 'text' }).subscribe({
        next: (response: string) => {
          this.devices = this.devices.filter(device => device.id !== id);
          this.toastr.success('Device deleted successfully.', 'Deleted');
        },
        error: (error) => {
          console.error('Error deleting device', error);
          this.toastr.error('Failed to delete the device. Please try again.', 'Error');
        }
      });
    }
  }

  logout() {
    this.http.post('https://webauthn.local:8443/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          console.log('Logout successful');
          localStorage.removeItem("username");
          this.toastr.info('Logged out successfully.', 'Logout');
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

export interface Device {
  id: number;
  deviceLabel: string;
  dateTime: string;
}
