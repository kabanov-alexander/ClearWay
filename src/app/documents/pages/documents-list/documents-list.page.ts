import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CwDocumentApiService } from '../../services/api/document.api.service';

@Component({
  selector: 'cw-documents-list',
  templateUrl: './documents-list.page.html',
  styleUrl: './documents-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink],
  providers: [CwDocumentApiService],
})
export class CwDocumentsListPage {
  private readonly documentApiService = inject(CwDocumentApiService);

  readonly documentsListResource = this.documentApiService.getDocumentsList();
}
