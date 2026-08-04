import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  // Salva o token na sessão do navegador
  saveToken(token: string): void {
    window.sessionStorage.removeItem(this.TOKEN_KEY);
    window.sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  // Recupera o token salvo
  getToken(): string | null {
    return window.sessionStorage.getItem(this.TOKEN_KEY);
  }

  // Remove o token (Logout)
  public clearToken(): void {
    window.sessionStorage.removeItem(this.TOKEN_KEY);
  }

  // Verifica se o usuário está autenticado
  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}