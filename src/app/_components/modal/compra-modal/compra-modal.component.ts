import { Component, ElementRef, Input, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { RifaService } from '../../../services/rifa.service';

// @Injectable({
//   providedIn: 'root'
// })

@Component({
  selector: 'app-compra-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compra-modal.component.html',
  styleUrls: ['./compra-modal.component.css']
})
export class CompraModalComponent {
  @ViewChild('dialogElement') dialog!: ElementRef<HTMLDialogElement>;
    
  @Input() numerosComprados: string = '';
  @Input() idRifa: string = '';
  valorTotal: number = 0;
  rifaInformationId: string = '';

  @Output() closeModal = new EventEmitter<void>();

  constructor(private router: Router, private rifaService: RifaService) {
    
    this.valorTotal = rifaService.getValorTotal();    
  }

  // Native HTML Dialog handling
  open() {
    this.rifaInformationId = this.idRifa;
    this.dialog.nativeElement.showModal();
  }

  close() {
    this.dialog.nativeElement.close();
    this.closeModal.emit();
    this.rifaService.limpar();
    this.router.navigate(['/cartela'], { queryParams: { id: this.rifaInformationId } });
  }
}
