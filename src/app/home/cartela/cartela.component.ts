import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RifaService } from '../../services/rifa.service';
import { ApiService } from '../../services/api.service';
import { TicketInterface } from '../../../models/ticket.interface';
interface NumeroRifa {
  valor: number;
  status: 'disponivel' | 'em-analise' | 'comprado';
  selecionado: boolean;
}

@Component({
  selector: 'app-cartela',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cartela.component.html',
  styleUrls: ['cartela.component.css']
})
export class CartelaComponent {
  numeros: NumeroRifa[] = [];
  tickets: TicketInterface [] = [];
  
  constructor(public rifaService: RifaService, 
    private router: Router, 
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute
  ) {}
  
  totalNumeros = signal(0);  
  dados: any;
  srcBase64: string = '';
  idRifa: string = '';

  dadosCarregado = signal(0);  

  //spinner = inject(NgxSpinnerService)
  
  async ngOnInit() {    
    
    try {
      
      await this.carregarDados();
      
    } catch (error) {
      console.error('Request failed', error);
    }
  }

  async carregarDados() {

    //this.spinner.show();    

    if(localStorage.getItem('numeros')){
      
      const numeros: number[] | undefined = localStorage.getItem('numeros')
      ?.split(',')
      .map((n: string) => Number(n) ?? 0);

      if(numeros && Array.isArray(numeros)){

        for(const num of numeros){

          this.rifaService.numerosSelecionados.push(num);
          this.rifaService.numerosSelecionados.sort((a, b) => a - b);

          localStorage.removeItem('numeros')
        }
      }
    }

    this.idRifa = this.activatedRoute.snapshot.queryParams['id'];

    this.dados = await this.apiService.getRifa(this.idRifa);
    
    this.srcBase64 = this.dados[0].img;

    this.rifaService.dadosRifa.id = this.dados[0]?._id || '';
    
    this.rifaService.dadosRifa.unitValue = this.dados[0]?.unitValue || 0;
    
    this.tickets = await this.apiService.getTickets(this.idRifa);

    this.totalNumeros.set(this.dados[0]?.totalNumbers || 0); // Atualiza o total de números disponíveis na cartela

    for (let i = 1; i <= this.totalNumeros(); i++) {
      let statusInicial: 'disponivel' | 'em-analise' | 'comprado' = 'disponivel';
      let selected: boolean = false;
      
      if (this.tickets.some(t => t.number === i)){
        const ticket = this.tickets.find(t => t.number === i);
  
        statusInicial = ticket?.status || 'disponivel';

      }     

      if(this.rifaService.numerosSelecionados.includes(i))
      {
        selected = true
      }
      
      this.numeros.push({
        valor: i,
        status: statusInicial,
        selecionado: selected
      });
    }
    
   // this.spinner.hide();
  }
  
  async bufferToBase64(buffer: ArrayBuffer): Promise<string> {
    const blob = new Blob([buffer]);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // The result includes the Data URL prefix (e.g., "data:application/octet-stream;base64,")
        // Split it to isolate the pure Base64 string string if needed
        const base64String = dataUrl.split(',')[1]; 
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
  const blob = new Blob([buffer]);
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

  alternarNumero(num: number) {

    const index = this.rifaService.numerosSelecionados.indexOf(num);
    if (index > -1) {
      this.rifaService.numerosSelecionados.splice(index, 1);
    } else {
      this.rifaService.numerosSelecionados.push(num);
      this.rifaService.numerosSelecionados.sort((a, b) => a - b); // Organiza em ordem crescente
    }    
  }

  estaSelecionado(num: number): boolean {
    return this.rifaService.numerosSelecionados.includes(num);
  }
  
  async verificarSelecao(num: number){

    if(this.estaSelecionado(num)){

      //this.spinner.show();  
  
      const dados = await this.apiService.getTicket(this.idRifa, num)
  
      
      if(dados.length > 0){
        this.alternarNumero(num)
        window.alert('Numero indisponível!')
        localStorage.setItem('numeros', this.rifaService.numerosSelecionados.join(','))
        window.location.reload()
      }

      //this.spinner.hide();
    }

  }

  limpar() {
    this.rifaService.limpar();
  }

  irParaCompra() {
    console.log(this.dados)
    console.log(this.idRifa)
    this.router.navigate([`/compra`], { queryParams: { id: this.idRifa } });
  }
}