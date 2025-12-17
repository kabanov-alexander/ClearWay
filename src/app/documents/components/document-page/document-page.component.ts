import { ChangeDetectionStrategy, Component, input} from '@angular/core';

import { CwDocumentPageModel } from '../../models/document-page.model';

@Component({
  selector: 'cw-document-page',
  templateUrl: './document-page.component.html',
  styleUrl: './document-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CwDocumentPageComponent {
  readonly cwPage = input.required<CwDocumentPageModel>();
}
