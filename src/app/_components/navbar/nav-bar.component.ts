import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {

  authService = inject(AuthService);
  router = inject(Router);

  logout() {    
    this.authService.clearToken();
    this.router.navigate(['/main']);

  }
}
