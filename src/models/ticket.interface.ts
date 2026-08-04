export interface TicketInterface {
   number: number,
   nome: string,
   phone: string,
   status: 'disponivel' | 'em-analise' | 'comprado';
}