import { Routes } from '@angular/router';
import { HeroListComponent } from './pages/hero-list/hero-list.component';

export const HERO_ROUTES: Routes = [
  {
    path: '',
    component: HeroListComponent,
    title: 'Heroes List'
  },
  {
    path: 'new',
    loadComponent: () => 
      import('./components/hero-form/hero-form.component')
        .then(m => m.HeroFormComponent),
    title: 'New Hero'
  },
  {
    path: 'edit/:id',
    loadComponent: () => 
      import('./components/hero-form/hero-form.component')
        .then(m => m.HeroFormComponent),
    title: 'Edit Hero'
  }
];