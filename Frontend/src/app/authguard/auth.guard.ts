import { inject } from '@angular/core';
import { CanActivateFn ,Router} from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = !!localStorage.getItem('username');

  if (!isLoggedIn) {
    const router = inject(Router);  // Inject Router
    router.navigate(['/login']);    // Redirect to login if not authenticated
    return false;                   // Deny access
  }
  return true;
};
