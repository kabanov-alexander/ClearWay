import { Route } from '@angular/router';

export const CW_DOCUMENTS_ROUTES: Route[] = [
  {
    path: 'documents',
    loadComponent: () => import('./pages/documents-list/documents-list.page').then(m => m.CwDocumentsListPage)
  },
  {
    path: 'documents/:documentId',
    loadComponent: () => import('./pages/document/document.page').then(m => m.CwDocumentPage)
  }
];
