import { Component , inject} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private router = inject(Router);
  registerClick(){
    this.router.navigateByUrl("/signup");
  }
  loginClick(){
    this.router.navigateByUrl("/login");
  }
  normalLoginClick(){
    this.router.navigateByUrl("/ologin");
  }
}
