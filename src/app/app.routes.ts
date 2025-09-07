import { Routes } from '@angular/router';
import { HomePage, LangPage, UnitPage } from '@pages';

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'home',
    redirectTo: '',
  },
  {
    path: 'lang/:id',
    component: LangPage
  },
  {
    path: 'unit/:id',
    component: UnitPage
  },
  {
    path: '**',
    redirectTo: '',
  },
];
