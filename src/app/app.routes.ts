import { Routes } from '@angular/router';
import { CartelaComponent } from './home/cartela/cartela.component';
import { CompraComponent } from './home/compra/compra.component';

export const routes: Routes = [
    { path: 'cartela', component: CartelaComponent },
    { path: 'compra', component: CompraComponent },
];
