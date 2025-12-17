import { ICwDocumentPageApi } from './document-page-api.interface';

export interface ICwDocumentApi {
  id: number;
  name: string;
  pages: Array<ICwDocumentPageApi>;
}
