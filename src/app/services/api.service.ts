import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { RifaInterface } from '../../models/rifa..interface';
import { TicketInterface } from '../../models/ticket.interface';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  private apiUrl = 'https://rifa-bkend.onrender.com'
  //private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient, private authService: AuthService) { }

  login(username: string, password: string): Observable<any>{

    return this.http.post<any>(`${this.apiUrl}/session`, {
      email: username,
      password
    })
  }
  
  async getRifa(id: string): Promise<RifaInterface[]> {

    return await firstValueFrom(this.http.get<RifaInterface[]>(this.apiUrl + `/rifa/${id}`));

  }

  async getRifas(): Promise<RifaInterface[]>{
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    })    

    return await firstValueFrom(this.http.get<RifaInterface[]>(`${this.apiUrl}/rifas`,  { headers }));
  }

  async getTickets(id: string): Promise<TicketInterface[]> {
    
    return await firstValueFrom(this.http.get<TicketInterface[]>(`${this.apiUrl}/tickets/${id}/rifa`));

  }

  async getTicket(id: string, num: number): Promise<TicketInterface[]> {

    return await firstValueFrom(this.http.get<TicketInterface[]>(`${this.apiUrl}/ticket/${id}/rifa/${num}`));

  }

  async getTicketsPayed(id: string): Promise<TicketInterface[]> {

    return await firstValueFrom(this.http.get<TicketInterface[]>(`${this.apiUrl}/tickets/${id}/payed`));
  }

  async buyTickets(id: string, tickets: TicketInterface[]): Promise<any>{
    return await firstValueFrom(this.http.post<any>(`${this.apiUrl}/comprar-tickets/${id}/rifa`, tickets))
  }

  async updateStatusTicket(id: string, num: number): Promise<any>{

    return await firstValueFrom(this.http.put<TicketInterface[]>(`${this.apiUrl}/update/${id}/ticket/${num}`,{}));
    
  }
}
