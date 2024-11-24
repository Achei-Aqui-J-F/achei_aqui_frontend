export interface EnderecoViewModel {
    id?: number;  // O ID pode ser opcional, especialmente se for uma criação
    estado: string;
    cep: string;
    bairro: string;
    rua: string;
    cidade: string;
}
export interface UserViewModel {
  id?: number;  // O ID pode ser opcional, especialmente se for uma criação
  nome: string;
  senha: string;
  email: string;
  telefone: string;
  endereco: EnderecoViewModel;  // Relacionamento com o EnderecoViewModel
  imagem?: string;  

}
