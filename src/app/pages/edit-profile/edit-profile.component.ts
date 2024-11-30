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
import { serviceEditProfile } from './services/service-edit-profile';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  constructor(
    private serviceUtils:serviceUtils,
    private serviceAuth: AuthService, 
    private service: serviceSignUp,
    private router: Router,
    private fb: FormBuilder,
    private serviceEditProfile: serviceEditProfile){

    }
  file: File | null = null;
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
  imageSrc: string = this.userLogged.imagem || "perfil-image-mock-my-perfil.png"
  ngOnInit(){
    if(this.serviceUtils.itemIsNull("userLogged")){
      this.serviceUtils.setUserLogged(this.userAuthCache.email)
    }else{
      this.userLogged = this.serviceUtils.getUserLogged()
      this.imageSrc = this.userLogged.imagem ||  "perfil-image-mock-my-perfil.png"


    }

    this.service.getStates().subscribe(
      (data: stateViewModel[]) => {
        this.states = data;  // Armazena a lista de estados transformada no array 'states'
      },
      error => {
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
 
  onSubmit(): void {
    if (this.file && this.userLogged.email) {
      this.serviceEditProfile.updateUserImage(this.file, this.userLogged.email).subscribe({
        next: (response) => {
          console.log('Imagem enviada com sucesso:', response);
        },
        error: (err) => {
        },
      });
    }
   
    this.user = {
      nome:  this.userLogged.nome,
      senha: this.userLogged.senha,
      email: this.cadastroForm.value.email || this.userLogged.email,
      telefone: this.cadastroForm.value.telefone || this.userLogged.email,
      endereco: {
        estado: this.cadastroForm.value.uf || this.userLogged.endereco.estado,
        cep: this.cadastroForm.value.cep || this.userLogged.endereco.cep,
        bairro: this.cadastroForm.value.bairro || this.userLogged.endereco.bairro,
        rua: this.cadastroForm.value.rua || this.userLogged.endereco.rua,
        cidade: this.cadastroForm.value.cidade ||this.userLogged.endereco.cidade,
      },
    };
    console.log('Dados enviados:', this.user);
    this.serviceEditProfile.updateUserInfos(this.user,this.userLogged.id?.toString()||'').subscribe({
      next: (response) => {
        console.log('Usuário criado com sucesso:', response),
        this.isLoading=false, 
        this.userAuthCache.email= this.user.email,
        console.log(this.userAuthCache.email),
        this.serviceUtils.setUserLogged(this.userAuthCache.email),
        
        this.serviceAuth.login({email: this.userAuthCache.email, senha:JSON.parse(localStorage.getItem('authToken')||'').senha})
        this.userLogged = this.serviceUtils.getUserLogged()

        this.router.navigate(['/my-profile'])
      },
      error: (err) => console.error('Erro na criação do usuário:', err),
    });
    
    
    console.log(this.serviceUtils.getUserLogged())

  }
  onBlurCEP(){


    const cep = this.cadastroForm.value.cep ? this.cadastroForm.value.cep : '';
  
    this.service.getAdressByCEP(cep).pipe(
      switchMap((adress: adressViewModel) => {
  
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
        this.cities = cities;
      },
      error => {
        console.error("Erro ao buscar cidades:", error);
      }
    );
  }
  onSelectCityChange(event: Event){
    this.service.getCities(this.cadastroForm.value.uf? this.cadastroForm.value.uf : '').subscribe(
      (data: cityViewModel[]) => {

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
        this.file = file
      };
      reader.readAsDataURL(file); // Lê o arquivo como Data URL
    }
  }
}
