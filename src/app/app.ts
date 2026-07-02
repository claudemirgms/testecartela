import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  // Gera um array contendo os números de 1 a 200
  numerosCartela: number[] = Array.from({ length: 200 }, (_, i) => i + 1);
  
  // Utiliza um Set para gerenciar os números selecionados sem duplicatas
  numerosSelecionados: Set<number> = new Set<number>();
  
  // Controle de exibição das telas do modal
  exibirModal: boolean = false;
  exibirPix: boolean = false;

  // Dados do formulário de compra
  nomeCompleto: string = '';
  telefone: string = '';
  qrCodePixUrl: string = '';

  // Alterna a seleção do número (adiciona se não houver, remove se já houver)
  alternarNumero(numero: number): void {
    if (this.numerosSelecionados.has(numero)) {
      this.numerosSelecionados.delete(numero);
    } else {
      this.numerosSelecionados.add(numero);
    }
  }

  // Verifica se o número está selecionado para aplicar a classe CSS de destaque
  isSelecionado(numero: number): boolean {
    return this.numerosSelecionados.has(numero);
  }

  // Retorna a lista de números selecionados formatada em ordem crescente
  get numerosFormatados(): string {
    return Array.from(this.numerosSelecionados).sort((a, b) => a - b).join(', ');
  }

  // Ação do botão principal de Compra
  abrirCompra(): void {
    if (this.numerosSelecionados.size === 0) {
      alert('Por favor, selecione pelo menos um número da cartela para continuar.');
      return;
    }
    this.exibirModal = true;
  }

  // Fecha o modal e limpa o formulário
  fecharModal(): void {
    this.exibirModal = false;
    this.exibirPix = false;
    this.nomeCompleto = '';
    this.telefone = '';
  }

  // Valida o formulário e gera o QR Code simulado
  finalizarCompra(): void {
    if (!this.nomeCompleto.trim() || !this.telefone.trim()) {
      alert('Por favor, preencha o seu Nome Completo e Telefone.');
      return;
    }

    // Texto que será codificado no QR Code (Simulação do payload do PIX)
    const dadosPix = `Rifa 1-200 | Numeros: ${this.numerosFormatados} | Comprador: ${this.nomeCompleto}`;
    
    // Utiliza uma API pública gratuita para gerar a imagem do QR Code a partir do texto
    this.qrCodePixUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(dadosPix)}`;
    
    this.exibirPix = true;
  }
}