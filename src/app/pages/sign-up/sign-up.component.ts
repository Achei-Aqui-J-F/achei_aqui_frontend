import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { serviceSignUp } from './services/service-sign-up';
import { stateViewModel } from './view-models/state-vm';
import { cityViewModel } from './view-models/city-vm';
import { adressViewModel } from './view-models/adress-vm';
import { switchMap } from 'rxjs/operators';
import { UserViewModel } from './view-models/user-vm';
import { BlobOptions } from 'buffer';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  
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
  passwordIsValid: boolean = true;
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

  constructor(private service: serviceSignUp) { }

  ngOnInit(): void {
    // O ngOnInit é chamado após a inicialização do componente
    this.service.getStates().subscribe(
      (data: stateViewModel[]) => {
        this.states = data;  // Armazena a lista de estados transformada no array 'states'
        console.log('Estados transformados:', this.states);
      },
      error => {
        console.error('Erro ao buscar estados:', error);
      }
    );
  }

  onSubmit(){
    console.log("SUBMIT")
    if(this.cadastroForm.valid){
      console.log("VALIDO")
      this.user = {
        nome: this.cadastroForm.value.nome + " " + this.cadastroForm.value.sobrenome,
        senha: this.cadastroForm.value.senha || "",
        email: this.cadastroForm.value.email || "",
        telefone: this.cadastroForm.value.telefone || "",
        endereco: {
          estado: this.cadastroForm.value.uf || "",
          cep: this.cadastroForm.value.cep || "",
          bairro: this.cadastroForm.value.bairro || "",
          rua: this.cadastroForm.value.rua || "",
          cidade: this.cadastroForm.value.cidade || "",
        },
      };
      console.log('Dados enviados:', this.user);
      this.service.createUser(this.user).subscribe({
        next: (response) => console.log('Usuário criado com sucesso:', response),
        error: (err) => console.error('Erro na criação do usuário:', err),
      });
    }else{
      console.log("INVALIDO")

      const senhaControle = this.cadastroForm.get('senha');
      if (senhaControle && senhaControle.invalid) {
        this.passwordIsValid = false
      }else{
          this.passwordIsValid = true
      }
    }
    
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
}
