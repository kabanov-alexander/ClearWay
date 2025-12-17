import { ChangeDetectionStrategy, Component, effect, output, signal } from '@angular/core';

const CW_MIN_ZOOM = 50;
const CW_MAX_ZOOM = 200;
const CW_ZOOM_STEP = 10;

@Component({
  selector: 'cw-document-actions',
  templateUrl: './document-actions.component.html',
  styleUrl: './document-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CwDocumentActionsComponent {
  readonly scaleInPercents = signal<number>(100);
  readonly documentRescale = output<number>();
  readonly documentSave = output<void>();

  constructor () {
    effect(() =>
      this.documentRescale.emit(this.scaleInPercents() / 100)
    );
  }

  onZoomInSave(): void {
    if (this.scaleInPercents() < CW_MAX_ZOOM) {
      this.scaleInPercents.set(
        this.scaleInPercents() + CW_ZOOM_STEP
      );
    }
  }

  onZoomOutSave(): void {
    if (this.scaleInPercents() > CW_MIN_ZOOM) {
      this.scaleInPercents.set(
        this.scaleInPercents() - CW_ZOOM_STEP
      );
    }
  }

  onSave(): void {
    this.documentSave.emit();
  }
}
