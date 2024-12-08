import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'heroes',
        loadChildren: () => 
          import('./features/heroes/heroes.routes')
            .then(m => m.HERO_ROUTES)
      },
      {
        path: '',
        redirectTo: 'heroes',
        pathMatch: 'full'
      }
];
