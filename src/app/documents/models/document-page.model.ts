import { ICwDocumentPageApi } from './interfaces/document-page-api.interface';

export class CwDocumentPageModel {
  constructor(
    public number: number,
    public imageUrl: string,
    public annotation: string | undefined = undefined
  ) {}

  public static fromApi(documentPageApi: ICwDocumentPageApi): CwDocumentPageModel {
    return new CwDocumentPageModel(
      documentPageApi.number,
      documentPageApi.imageUrl
    );
  }

  public static toApi(documentPage: CwDocumentPageModel): ICwDocumentPageApi {
    return documentPage;
  }
}
