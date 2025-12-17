import { Routes } from '@angular/router';

import { CW_DOCUMENTS_ROUTES } from './documents/documents.routes';
import { CwWelcomePage } from './core/pages/welcome/welcome.page';

export const routes: Routes = [
  {
    path: '',
    component: CwWelcomePage
  },
  ...CW_DOCUMENTS_ROUTES,
  {
    path: '**',
    loadComponent: () => import('./core/pages/resource-not-found/resource-not-found.page').then(m => m.CwResourceNotFoundPage)
  }
];
