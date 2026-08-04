import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { RifaService } from '../../services/rifa.service';
import { TicketInterface } from '../../../models/ticket.interface';
import { CompraModalComponent } from '../../_components/modal/compra-modal/compra-modal.component';

@Component({
  selector: 'app-rifa-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, CompraModalComponent],
  templateUrl: "./compra.component.html",
  styleUrls: ["./compra.component.css"]
})
export class CompraComponent {
  rifaId: string = '';
  valorTotal: number = 0;

  @ViewChild('compraModal') compraModal!: CompraModalComponent;

  
  constructor(public rifaService: RifaService, 
              private apiService: ApiService,
              private router: Router, 
              private activatedRoute: ActivatedRoute,
            private http: HttpClient) {
    // Validação de segurança: se o usuário caiu aqui sem números, volta para a home
    
    
    
    if (this.rifaService.numerosSelecionados.length === 0) {
      this.redirectTo()
    }
  }

  async buyTickets(): Promise<void> {
    
    const tickets: any[] = [];

    this.rifaService.setId(this.activatedRoute.snapshot.queryParams['id']);
    this.rifaId = this.rifaService.getId()

    console.log(this.rifaId)
    
    for (const numero of this.rifaService.numerosSelecionados) {

      const ticket: TicketInterface = {
        "number": numero,
        "nome": this.rifaService.dadosComprador.nome,
        "phone": this.rifaService.dadosComprador.telefone,
        "status": "em-analise"
      }

      tickets.push(ticket);

    };
    
    var retorno = await this.apiService.buyTickets(this.rifaId, tickets);
    
    console.log('retorno:', retorno)
    
    this.rifaService.limpar();
    
  }

    // Valida o formulário e gera o QR Code simulado
    async finalizarCompra(): Promise<void> {
      if (!this.rifaService.dadosComprador.nome || !this.rifaService.dadosComprador.telefone.trim()) {
        alert('Por favor, preencha o seu Nome Completo e Telefone.');
        return;
      }

      await this.buyTickets();

      this.valorTotal = this.rifaService.numerosSelecionados.length * this.rifaService.dadosRifa.unitValue;

      this.showModal()
    }
  
  redirectTo() {
    this.router.navigate(['/cartela'], { queryParams: { id: this.rifaId } });
  }

  showModal(){
    setTimeout(() => {
      this.compraModal.open();
    });
  }

  clearSelection() {
    //this.selectedUser = null;
  }
}