import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserViewModel } from '../view-models/user-vm';
@Injectable({
    providedIn: 'root',  // Registra o serviço no nível global
  })
export class serviceLogIn{

    private acheiAquiApi = 'https://api-achei-aqui-default.onrender.com'
    
    constructor(private http: HttpClient) {
    
    }
    getUserByEmail(email:string): Observable<UserViewModel>{
        return this.http.get<UserViewModel>(`${this.acheiAquiApi}/achados/fetch_user_by_email?email=${email}`)
    }

}