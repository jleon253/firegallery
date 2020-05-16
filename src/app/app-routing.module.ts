import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FotosComponent } from './components/fotos/fotos.component';
import { CargaComponent } from './components/carga/carga.component';


const routes: Routes = [
  {path: 'galeria', component: FotosComponent},
  {path: 'cargar', component: CargaComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'galeria'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
