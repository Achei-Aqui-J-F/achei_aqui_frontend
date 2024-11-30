import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuard } from '../../../routesProtection/auth-guard';
import { serviceUtils } from '../../services/service-utils';
import { AuthService } from '../../../routesProtection/auth-service';
import { serviceEditProfile } from '../../edit-profile/services/service-edit-profile';
import { UserViewModel } from '../../log-in/view-models/user-vm';
import { logInUserViewModel } from '../../../routesProtection/log-in-user-vm';
import { serviceSignUp } from '../../sign-up/services/service-sign-up';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() myProfileUrl: string = ""
  imageSrc:string = ''
  userAuthCache: logInUserViewModel =JSON.parse( localStorage.getItem("authToken") || "")
  userLogged : UserViewModel = {
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
  constructor(
    private serviceUtils:serviceUtils,
    private serviceAuth: AuthService, 
    private service: serviceSignUp,
    private router: Router,
    private serviceEditProfile: serviceEditProfile){

    }

  ngOnInit(){
    if(this.serviceUtils.itemIsNull("userLogged")){
      this.serviceUtils.setUserLogged(this.userAuthCache.email)
    }else{
      this.userLogged = this.serviceUtils.getUserLogged()
      this.imageSrc = this.userLogged.imagem ||  "perfil-image-mock-my-perfil.png"


    }

    
    
  }
}

