import { Injectable, Signal } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';

import { CwDocumentModel } from '../../models/document.model';
import { ICwDocumentApi } from '../../models/interfaces/document-api.interface';

@Injectable()
export class CwDocumentApiService {
  getDocumentById(id: Signal<number>): HttpResourceRef<CwDocumentModel | undefined> {
    return httpResource<CwDocumentModel>(() => `./document${id()}.json`, {
      parse: (document) => CwDocumentModel.fromApi(document as ICwDocumentApi)
    });
  }

  getDocumentsList(): HttpResourceRef<CwDocumentModel[] | undefined> {
    return httpResource<CwDocumentModel[]>(() => './documents.json', {
      parse: (documents) => (documents as ICwDocumentApi[]).map(CwDocumentModel.fromApi)
    });
  }
}
