import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if ( await this.authService.isAuthenticated()) {
      return true;
    }

    // Redireciona para a página de login se não estiver autenticado
    this.router.navigate(['/log-in']);
    return false;
  }
}
