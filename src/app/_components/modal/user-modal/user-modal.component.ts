import { Component, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent {
  @ViewChild('dialogElement') dialog!: ElementRef<HTMLDialogElement>;
  
  
  @Input() user: any = null;
  @Output() closeModal = new EventEmitter<void>();

  // Native HTML Dialog handling
  open() {
    this.dialog.nativeElement.showModal();
  }

  close() {
    this.dialog.nativeElement.close();
    this.closeModal.emit();
  }
}
