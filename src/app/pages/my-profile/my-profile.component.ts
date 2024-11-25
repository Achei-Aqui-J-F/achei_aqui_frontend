import { Component } from '@angular/core';
import { serviceUtils } from '../services/service-utils';
import { AuthService } from '../../routesProtection/auth-service';
import { UserViewModel } from '../log-in/view-models/user-vm';
import { logInUserViewModel } from '../../routesProtection/log-in-user-vm';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  constructor(private router: Router,private serviceUtils:serviceUtils, private serviceAuth: AuthService){}
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
  editDetails(){
    this.router.navigate(['my-profile/edit-profile'])
  }

}
