import { CwDocumentPageModel } from './document-page.model';
import { ICwDocumentApi } from './interfaces/document-api.interface';

export class CwDocumentModel {
  constructor(
    public id: number,
    public name: string,
    public pages: Array<CwDocumentPageModel>
  ) {}

  public static fromApi(documentApi: ICwDocumentApi): CwDocumentModel {
    return new CwDocumentModel(
      documentApi.id,
      documentApi.name,
      documentApi.pages.map(CwDocumentPageModel.fromApi)
    );
  }

  public static toApi(document: CwDocumentModel): ICwDocumentApi {
    return document;
  }
}
