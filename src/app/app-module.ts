import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MainLayout } from './layout/main-layout/main-layout';
import { Sidebar } from './layout/sidebar/sidebar';
import { Header } from './layout/header/header';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Trabajadores } from './pages/trabajadores/trabajadores';
import { Planillas } from './pages/planillas/planillas';
import { Reportes } from './pages/reportes/reportes';
import { Auditoria } from './pages/auditoria/auditoria';
import { Usuarios } from './pages/usuarios/usuarios';
import { Empresas } from './pages/empresas/empresas';
import { Configuracion } from './pages/configuracion/configuracion';

@NgModule({
  declarations: [
    App,
    MainLayout,
    Sidebar,
    Header,
    Login,
    Dashboard,
    Trabajadores,
    Planillas,
    Reportes,
    Auditoria,
    Usuarios,
    Empresas,
    Configuracion
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
