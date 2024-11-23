import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { stateViewModel } from '../view-models/state-vm';
import { cityViewModel } from '../view-models/city-vm';
import { adressViewModel } from '../view-models/adress-vm';


import { responseStateViewModel } from '../view-models/response-state-vm';
import { responseCityViewModel } from '../view-models/response-city-vm';

import { map } from 'rxjs/operators';
import { responseAdressViewModel } from '../view-models/response-adress-vm';
@Injectable({
    providedIn: 'root',  // Registra o serviço no nível global
  })
export class serviceSignUp{
    private ibgeUrl = 'https://servicodados.ibge.gov.br/api/v1'; 
    private viacepUrl = 'https://viacep.com.br/ws/'
    
    constructor(private http: HttpClient) {

    }

    getStates(): Observable<stateViewModel[]> {
        
        return this.http.get<responseStateViewModel[]>(`${this.ibgeUrl}/localidades/estados/`).pipe(
            map((estados: responseStateViewModel[]) => 
              estados
                .map(state => ({
                  value: state.sigla,
                  view: state.nome
                }))
                .sort((a, b) => a.view.localeCompare(b.view))  // Ordenando pelo nome (view) em ordem alfabética
            )
          );
      
    }
    getAdressByCEP(cep:string): Observable<adressViewModel> {
        
        return this.http.get<responseAdressViewModel>(`${this.viacepUrl}/${cep}/json`).pipe(
            map((endereco: responseAdressViewModel) => ({
              city: endereco.localidade,
              district: endereco.bairro,
              street: endereco.logradouro,
              state: endereco.uf,
            }))
          )
      
    }
    getCities(uf:string): Observable<cityViewModel[]> {
        
        return this.http.get<responseCityViewModel[]>(`${this.ibgeUrl}/localidades/estados/${uf}/municipios`).pipe(
            map((cidades: responseCityViewModel[]) => 
              cidades
                .map(cidade => ({
                  value: cidade.nome,
 
                }))
                .sort((a, b) => a.value.localeCompare(b.value))  // Ordenando pelo nome (view) em ordem alfabética
            )
          );
      
    }


}