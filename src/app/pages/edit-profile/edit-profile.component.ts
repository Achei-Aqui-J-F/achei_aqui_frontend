import { Component } from '@angular/core';
import { logInUserViewModel } from '../../routesProtection/log-in-user-vm';
import { serviceUtils } from '../services/service-utils';
import { AuthService } from '../../routesProtection/auth-service';
import { UserViewModel } from '../log-in/view-models/user-vm';
import { Router } from '@angular/router';
import { serviceSignUp } from '../sign-up/services/service-sign-up';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import { cityViewModel } from '../sign-up/view-models/city-vm';
import { stateViewModel } from '../sign-up/view-models/state-vm';
import { adressViewModel } from '../sign-up/view-models/adress-vm';
import { switchMap } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  constructor(private serviceUtils:serviceUtils, private serviceAuth: AuthService, private service: serviceSignUp ,private router: Router,private fb: FormBuilder){}
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
  cadastroForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    sobrenome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone: new FormControl('', Validators.required),
    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(8), // Senha com pelo menos 8 caracteres
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}') // Letras maiúsculas, minúsculas e números
    ]),
    cep: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    bairro: new FormControl('', Validators.required),
    rua: new FormControl('', Validators.required),
    uf: new FormControl('', Validators.required),
  });
  fileName: string = ''; // Nome do arquivo
  imageSrc: string  = "perfil-image-mock-my-perfil.png";
  ngOnInit(){
    if(this.serviceUtils.itemIsNull("userLogged")){
      console.log("Não Existe Cachê")
      this.serviceUtils.setUserLogged(this.userAuthCache.email)
    }else{
      console.log("Existe Cachê")
      this.userLogged = this.serviceUtils.getUserLogged()

    }

    this.service.getStates().subscribe(
      (data: stateViewModel[]) => {
        this.states = data;  // Armazena a lista de estados transformada no array 'states'
        console.log('Estados transformados:', this.states);
      },
      error => {
        console.error('Erro ao buscar estados:', error);
      }
    );
    this.cadastroForm = this.fb.group({
      nome: this.userLogged.nome,
      sobrenome: '',
      email: this.userLogged.email,
      telefone: this.userLogged.telefone,
      senha: this.userLogged.senha,
      cep: this.userLogged.endereco.cep,
      cidade: this.userLogged.endereco.cidade,
      bairro: this.userLogged.endereco.bairro,
      rua: this.userLogged.endereco.rua,
      uf: this.userLogged.endereco.estado,
    })
    // console.log("GETUSERLOGGED : " + this.serviceUtils.getUserLogged(this.userAuthCache.email))
    this.service.getCities(this.cadastroForm.value.uf? this.cadastroForm.value.uf : '').subscribe(
      (data: cityViewModel[]) => {
        console.log(data)
        console.log(this.cadastroForm.value.uf)
        this.cities = data;  
        
      },
      error => {
      }
    );
  }
  
  
  passwordIsValid: boolean = true;
  formIsValid: boolean = true;

  states:stateViewModel[] = []
  cities:cityViewModel[] = []
  adress:adressViewModel = {city:"", district:"", state:"", street:""}
  user: UserViewModel = {
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
  isLoading: boolean = false;  // Controla o estado de carregamento



  

  onSubmit(){
    
    
  }
  onBlurCEP(){
    console.log("CEP DIGITADO")

    console.log("CEP DIGITADO");

    const cep = this.cadastroForm.value.cep ? this.cadastroForm.value.cep : '';
  
    this.service.getAdressByCEP(cep).pipe(
      switchMap((adress: adressViewModel) => {
        console.log(adress);
  
        // Atualizando o formulário com os dados do endereço
        this.cadastroForm.patchValue({
          uf: adress.state,
          cidade: adress.city,
          bairro: adress.district,
          rua: adress.street,
        });
  
        this.adress = adress;
        
        // Chamando a segunda API para obter as cidades
        return this.service.getCities(adress.state);
        
        
      })
    ).subscribe(
      (cities: cityViewModel[]) => {
        console.log(cities);
        this.cities = cities;
      },
      error => {
        console.error("Erro ao buscar cidades:", error);
      }
    );
    

  }
  onSelectCityChange(event: Event){
    console.log(this.cadastroForm)
    this.service.getCities(this.cadastroForm.value.uf? this.cadastroForm.value.uf : '').subscribe(
      (data: cityViewModel[]) => {
        console.log(data)
        console.log(this.cadastroForm.value.uf)
        this.cities = data;  
        
      },
      error => {
      }
    );
  }
  generateHash(data: string): string {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name; // Atualiza o nome do arquivo

      // Cria um FileReader para ler o arquivo como URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result; // Define a URL para a tag <img>
      };
      reader.readAsDataURL(file); // Lê o arquivo como Data URL
    }
  }
}
