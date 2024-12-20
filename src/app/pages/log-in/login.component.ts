import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { serviceLogIn } from './services/service-log-in';
import { UserViewModel } from './view-models/user-vm';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { AuthService } from '../../routesProtection/auth-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
   
    email: new FormControl('', Validators.required),
    senha: new FormControl('',  Validators.required),
  
  });
  correctLogin: boolean = true;

  
  constructor(private service: serviceLogIn, private router: Router, private authService: AuthService) { }

  userData:UserViewModel = {
    nome: '',
    senha: '',
    email: '',
    telefone: '',
    endereco: {
      estado: '',
      cep: '',
      bairro: '',
      rua: '',
      cidade: '',
    }
  };

  
  onSubmit(){
    if(this.loginForm.valid){
      this.service.getUserByEmail(this.loginForm.value.email||"").subscribe(
        (data: UserViewModel) => {
          this.correctLogin = this.compararHashs(this.loginForm.value.senha||"", data.senha )
          this.authService.login({"email":data.email, "senha":this.loginForm.value.senha||""})
          this.router.navigate(['/home'])
      },
      error => {
        console.error('Erro ao buscar estados:', error);
      })
    }
  }
  gerarHash(senha: string): string {
    return CryptoJS.SHA256(senha).toString(CryptoJS.enc.Hex);
  }
  
  // Função para comparar o hash gerado com o hash armazenado
  compararHashs(senha: string, hashArmazenado: string): boolean {
    const hashGerado = this.gerarHash(senha); // Gera o hash da senha recebida
    return hashGerado === hashArmazenado; // Compara o hash gerado com o armazenado
  }
  verificarRotaAtual() {
    return this.router.url

  }
}
