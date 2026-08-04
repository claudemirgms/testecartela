import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';



@Component({
  selector: 'app-data-rifa',
  imports: [CommonModule, FormsModule],
  templateUrl: './data-rifa.component.html',
  styleUrl: 'data-rifa.component.css',
})
export class DataRifaComponent  implements OnInit {
  dados: any;
  private router = inject(Router)
  numeroRifas = signal(0);  

  constructor(private apiService: ApiService,
              private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    try {      
      await this.carregarDados();      
    } catch (error) {
      console.error('Request failed', error);
    }
  }

  async carregarDados() {
    this.dados = await this.apiService.getRifas()    
    console.log(this.dados)
    this.numeroRifas.set(this.dados.length);    
  }

}