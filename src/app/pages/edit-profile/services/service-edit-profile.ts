import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserViewModel } from '../../log-in/view-models/user-vm';
@Injectable({
    providedIn: 'root',  // Registra o serviço no nível global
  })
export class serviceEditProfile{

    private acheiAquiApi = 'https://api-achei-aqui-default.onrender.com'
    
    constructor(private http: HttpClient) {
    
    }
    updateUserImage(file: File, userEmail: string): Observable<any> {
        // Cria o objeto FormData
        const formData = new FormData();
        formData.append('file', file); // Adiciona o arquivo
        formData.append('userEmail', userEmail); // Adiciona o e-mail
        console.log(file)
    
        // Faz a requisição POST
        return this.http.post(`${this.acheiAquiApi}/achados/upload_image`, formData);
      }
    updateUserInfos(user: UserViewModel, id:string): Observable<any>{
      return this.http.put(`${this.acheiAquiApi}/achados/update_user?id=${id}`,user, {
        headers: { 'Content-Type': 'application/json' }, // Garante que os dados enviados sejam JSON
        responseType: 'text' as 'json', // Configura para aceitar resposta como texto
      });


    }

}