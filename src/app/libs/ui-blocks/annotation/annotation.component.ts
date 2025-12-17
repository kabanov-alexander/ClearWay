import { FormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  InjectionToken,
  input,
  model,
  output,
  Renderer2,
  signal,
  viewChild
} from '@angular/core';

import { calculateMousePositionAbsolute } from '../../utils/mouse-position.utils';
import { ICwLibPosition } from '../../interfaces/position.interface';
import { CW_DOM_MOUSE_EVENTS } from '../../interfaces/dom-events.enum';
import { CW_DOM_ELEMENTS } from '../../interfaces/dom-elements.enum';

export const CW_LIB_ANNOTATION_START_POSITION_TOKEN = new InjectionToken<ICwLibPosition>(
  'CW_LIB_ANNOTATION_START_POSITION_TOKEN'
);

@Component({
  selector: 'cw-lib-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class CwLibAnnotationComponent {
  private readonly renderer = inject(Renderer2);
  private startPosition = inject<ICwLibPosition>(CW_LIB_ANNOTATION_START_POSITION_TOKEN);

  readonly cwLibAnnotation = model<string>();
  readonly cwLibAnnotationScaleX = input<number>(1);
  readonly cwLibAnnotationScaleY = input<number>(1);
  readonly cwLibAnnotationOver = output<boolean>();

  readonly annotationField = viewChild<ElementRef<HTMLTextAreaElement>>('annotationField');
  readonly currentPosition = signal<ICwLibPosition>(this.startPosition);
  readonly isEditable = signal(false);

  private onMouseMoveListener: (() => void) | undefined;

  @HostBinding('style.top.px')
  get hostStyleTop(): number {
    return this.currentPosition().top;
  }

  @HostBinding('style.left.px')
  get hostStyleLeft(): number {
    return this.currentPosition().left;
  }

  @HostListener(`${CW_DOM_MOUSE_EVENTS.MOUSE_ENTER}`)
  onMouseEnter(): void {
    this.cwLibAnnotationOver.emit(true);
  }

  @HostListener(`${CW_DOM_MOUSE_EVENTS.MOUSE_LEAVE}`)
  onMouseLeave(): void {
    this.cwLibAnnotationOver.emit(false);
  }

  @HostListener(`${CW_DOM_MOUSE_EVENTS.DOUBLE_CLICK}`)
  onDoubleClick(): void {
    this.isEditable.set(true);
  }

  @HostListener(`${CW_DOM_MOUSE_EVENTS.MOUSE_DOWN}`, ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.startPosition = this.calculateMousePosition(event);

    this.onMouseMoveListener = this.renderer.listen(
      CW_DOM_ELEMENTS.DOCUMENT,
      CW_DOM_MOUSE_EVENTS.MOUSE_MOVE,
      (event: MouseEvent) => this.onMouseMove(event)
    );

    const onMouseUpListener = this.renderer.listen(
      CW_DOM_ELEMENTS.DOCUMENT,
      CW_DOM_MOUSE_EVENTS.MOUSE_UP,
      () => {
        if (this.onMouseMoveListener) {
          this.onMouseMoveListener();
          this.onMouseMoveListener = undefined;
        }

        onMouseUpListener();
      }
    );
  }

  private onMouseMove(event: MouseEvent): void {
    const newPosition = this.calculateMousePosition(event);

    this.currentPosition.set({
      top: this.hostStyleTop + (newPosition.top - this.startPosition.top),
      left: this.hostStyleLeft + (newPosition.left - this.startPosition.left)
    });

    this.startPosition = newPosition;
  }

  private calculateMousePosition(event: MouseEvent): ICwLibPosition {
    return calculateMousePositionAbsolute(
      event,
      this.cwLibAnnotationScaleX(),
      this.cwLibAnnotationScaleY()
    );
  }

  onTextAreaMouseDown(event: MouseEvent): void {
    event.stopPropagation();
  }

  onAcceptClick(): void {
    const annotation = this.annotationField()?.nativeElement.value;

    this.cwLibAnnotation.set(
      !!annotation
        ? annotation
        : undefined
    );

    this.isEditable.set(false);
  }

  onClearClick(): void {
    this.cwLibAnnotation.set(undefined);
  }
}
