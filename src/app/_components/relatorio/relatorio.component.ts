import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { TicketInterface } from '../../../models/ticket.interface';
import { ApiService } from '../../services/api.service';

import { RifaService } from '../../services/rifa.service';

interface ContatoRelatorio {
  numero: number;
  nome: string;
  telefone: string;
  status: string;
}

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit{
  
  tickets: TicketInterface [] = [];
  
  idRifa: string = '';

  totalRegistros = signal(0);  

  valorUnitario = signal(0);
  totalNumerosPago = signal(0);

  constructor(private activatedRoute: ActivatedRoute, 
              private apiService: ApiService,              
              private rifaService: RifaService
              ){}

  async ngOnInit() {   

    try {
      
      await this.carregarDados();
      
    } catch (error) {
      console.error('Request failed', error);
    }  
    
  }

  async carregarDados() {

    //this.spinner.show();    

    this.idRifa = this.activatedRoute.snapshot.params['id'];

    this.rifaService.dadosRifa.id = this.idRifa;

    this.tickets = await this.apiService.getTickets(this.idRifa);
    this.tickets = [... this.tickets].sort((a, b) => a.number - b.number);

    this.totalRegistros.set(this.tickets.length)

    this.setTotalPago()

    //this.spinner.hide();
  }

  async updateStatus(num: number){
    const resposta = await this.apiService.updateStatusTicket(this.idRifa, num)

    window.location.reload()
    
  }

  async setTotalPago(){

    const resposta = await this.apiService.getTicketsPayed(this.rifaService.dadosRifa.id)
    this.totalNumerosPago.set(resposta.length)

    const response = await this.apiService.getRifa(this.rifaService.dadosRifa.id);
    this.valorUnitario.set(response[0]?.unitValue)
    
    return this.rifaService.getTotalPago()
  }
}
