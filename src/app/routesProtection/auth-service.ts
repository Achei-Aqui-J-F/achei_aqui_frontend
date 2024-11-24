import { Injectable } from '@angular/core';
import { serviceLogIn } from '../pages/log-in/services/service-log-in';
import { UserViewModel } from '../pages/log-in/view-models/user-vm';
import * as CryptoJS from 'crypto-js';
import { logInUserViewModel } from './log-in-user-vm';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private serviceLogIn:serviceLogIn) {}
  token:logInUserViewModel = {
    email: '',
    senha: '',

  };
  login(token: logInUserViewModel) {
    localStorage.setItem('authToken',JSON.stringify(token)); // Armazena o token
  }

  logout() {
    localStorage.removeItem('authToken'); // Remove o token
  }
  

  isAuthenticated(): Promise<boolean> {
    const tokenStorage = localStorage.getItem('authToken');
    this.token = tokenStorage ? JSON.parse(tokenStorage) : {
      senha: '',
      email: '',
    };
  
    return new Promise<boolean>((resolve, reject) => {
      this.serviceLogIn.getUserByEmail(this.token.email).subscribe(
        (data: UserViewModel) => {
          const isValid = this.compararHashs(this.token.senha, data.senha);
          resolve(isValid); // Resolve a Promise com o resultado de compararHashs
        },
        error => {
          console.error('Erro ao buscar estados:', error);
          reject(false); // Reject a Promise em caso de erro
        }
      );
    });
  }
  gerarHash(senha: string): string {
    return CryptoJS.SHA256(senha).toString(CryptoJS.enc.Hex);
  }
  
  // Função para comparar o hash gerado com o hash armazenado
  compararHashs(senha: string, hashArmazenado: string): boolean {
    const hashGerado = this.gerarHash(senha); // Gera o hash da senha recebida
    console.log(hashGerado, hashArmazenado)
    return hashGerado === hashArmazenado; // Compara o hash gerado com o armazenado
  }
}
