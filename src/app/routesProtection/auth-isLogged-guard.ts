import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthIsLoggedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Verifica se o usuário está autenticado
    return this.authService.isAuthenticated().then(isAuthenticated => {
      if (isAuthenticated) {
        // Se estiver autenticado, redireciona para a página principal ou dashboard
        this.router.navigate(['/home']); // Ou qualquer rota de destino
        return false; // Bloqueia o acesso à página de login
      }
      return true; // Permite o acesso à página de login
    });
  }
}
