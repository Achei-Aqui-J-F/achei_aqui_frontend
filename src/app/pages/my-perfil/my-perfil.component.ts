import { Component } from '@angular/core';
import { serviceUtils } from '../services/service-utils';
import { AuthService } from '../../routesProtection/auth-service';
import { UserViewModel } from '../log-in/view-models/user-vm';
import { logInUserViewModel } from '../../routesProtection/log-in-user-vm';
@Component({
  selector: 'app-my-perfil',
  templateUrl: './my-perfil.component.html',
  styleUrl: './my-perfil.component.css'
})
export class MyPerfilComponent {

  constructor(private serviceUtils:serviceUtils, private serviceAuth: AuthService){}
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
  ngOnInit(){
    if(this.serviceUtils.itemIsNull("userLogged")){
      console.log("Não Existe Cachê")
      this.serviceUtils.setUserLogged(this.userAuthCache.email)
    }else{
      console.log("Existe Cachê")
      this.userLogged = this.serviceUtils.getUserLogged()

    }
    // console.log("GETUSERLOGGED : " + this.serviceUtils.getUserLogged(this.userAuthCache.email))
    
  }
  

}
