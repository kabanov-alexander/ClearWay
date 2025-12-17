import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  createComponent,
  EnvironmentInjector,
  inject,
  input,
  OnDestroy,
  outputBinding,
  signal
} from '@angular/core';

import { CwDocumentActionsComponent } from '../../components/document-actions/document-actions.component';
import { CwDocumentPageComponent } from '../../components/document-page/document-page.component';
import { CwAnnotationDirective } from '../../../libs/ui-blocks/annotation/annotation.directive';
import { CwDocumentApiService } from '../../services/api/document.api.service';
import { CwDocumentPageModel } from '../../models/document-page.model';
import { CwRootComponent } from '../../../core/root.component';

@Component({
  selector: 'cw-document',
  templateUrl: './document.page.html',
  styleUrl: './document.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CwDocumentPageComponent, CwAnnotationDirective],
  providers: [CwDocumentApiService],
})
export class CwDocumentPage implements OnDestroy {
  private readonly documentApiService = inject(CwDocumentApiService);
  private readonly rootComponent = inject(CwRootComponent);

  readonly documentId = input.required<number>();
  readonly documentResource = this.documentApiService.getDocumentById(this.documentId);

  readonly scaleRate = signal(1);
  readonly scaleProperty = computed(() => `scale(${this.scaleRate()})`);

  constructor() {
    this.rootComponent.addRootActions((hostElement) =>
      createComponent(CwDocumentActionsComponent, {
        environmentInjector: inject(EnvironmentInjector),
        hostElement,
        bindings: [
          outputBinding<void>('documentSave', () =>
            console.log(this.documentResource.value())
          ),
          outputBinding<number>('documentRescale', (scaleRate) =>
            this.scaleRate.set(scaleRate)
          ),
        ]
      })
    );
  }

  onPageAnnotationChanged(page: CwDocumentPageModel, annotation: string | undefined): void {
    if (this.documentResource.hasValue()) {
      const document = this.documentResource.value();
      const pages = document.pages.map((p) =>
        p.number === page.number
          ? { ...p, annotation }
          : p
      );

      this.documentResource.set({ ...document, pages });
    }
  }

  ngOnDestroy(): void {
    this.rootComponent.removeRootActions();
  }
}
