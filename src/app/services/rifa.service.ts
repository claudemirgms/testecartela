import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RifaService {
  numerosSelecionados: number[] = [];
  dadosComprador = { nome: '', telefone: '' };
  dadosRifa = {id: '', unitValue: 0 };

  constructor(private apiservice: ApiService, private activatedRoute: ActivatedRoute){}

  limpar() {
    this.numerosSelecionados = [];
  }

  clearDadosComprador(){
    this.dadosComprador.nome = '';
    this.dadosComprador.telefone = '';
  }

  getValorTotal(): number {
    return this.numerosSelecionados.length * this.dadosRifa.unitValue;
  }

  getId(): string{
    return this.dadosRifa.id;
  }

  setId(id: string): void{
    this.dadosRifa.id = id;
  }

  async getTotalPago(){
    const retorno = await this.apiservice.getTicketsPayed(this.dadosRifa.id)
    console.log(retorno.length)
    return retorno.length
  }
}