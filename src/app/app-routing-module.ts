import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './layout/main-layout/main-layout';

import { Trabajadores } from './pages/trabajadores/trabajadores';
import { Planillas } from './pages/planillas/planillas';
import { Reportes } from './pages/reportes/reportes';
import { Auditoria } from './pages/auditoria/auditoria';
import { Usuarios } from './pages/usuarios/usuarios';
import { Empresas } from './pages/empresas/empresas';
import { Configuracion } from './pages/configuracion/configuracion';

const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'trabajadores',
        component: Trabajadores
      },
      {
        path: 'planillas',
        component: Planillas
      },
      {
        path: 'reportes',
        component: Reportes
      },
      {
        path: 'auditoria',
        component: Auditoria
      },
      {
        path: 'usuarios',
        component: Usuarios
      },
      {
        path: 'empresas',
        component: Empresas
      },
      {
        path: 'configuracion',
        component: Configuracion
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }