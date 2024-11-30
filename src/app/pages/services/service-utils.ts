import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserViewModel } from '../log-in/view-models/user-vm';
import { serviceLogIn } from '../log-in/services/service-log-in';
@Injectable({
    providedIn: 'root',  // Registra o serviço no nível global
  })
export class serviceUtils{
    
    
    constructor(private http: HttpClient, private serviceLogIn:serviceLogIn) {
    
    }
    setUserLogged(email:string){        
        this.serviceLogIn.getUserByEmail(email).subscribe(
            (data: UserViewModel) => {
                localStorage.setItem( "userLogged", JSON.stringify(data))
                console.log(data)
                return data
            },
            error => {
              // Reject a Promise em caso de erro
            }
          );
    }
    getUserLogged():UserViewModel{
                
        return JSON.parse( localStorage.getItem("userLogged") || "") || {
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
    }
    itemIsNull(item:string):boolean{
        console.log(localStorage.getItem(item))
        return ( localStorage.getItem(item) === null)
    }
}

    
