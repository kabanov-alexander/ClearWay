import {
  ComponentRef,
  Directive,
  effect,
  HostBinding,
  HostListener,
  inject,
  Injector,
  input,
  inputBinding,
  output,
  outputBinding,
  signal,
  ViewContainerRef
} from '@angular/core';

import { calculateMousePositionRelativeTo } from '../../utils/mouse-position.utils';
import { CW_DOM_MOUSE_EVENTS } from '../../interfaces/dom-events.enum';
import { ICwLibPosition } from '../../interfaces/position.interface';
import { isString } from '../../utils/type-checkers.utils';
import {
  CW_LIB_ANNOTATION_START_POSITION_TOKEN,
  CwLibAnnotationComponent
} from './annotation.component';

type TAnnotation = string | undefined;

const CW_ANNOTATION_PLACEHOLDER = 'Double click to change the annotation';
const CW_OVER_ANNOTATION_BORDER = '5px solid rgba(255 247 0 / 100%)';
const CW_EXISTING_ANNOTATION_BORDER = '5px solid rgba(255 247 0 / 40%)';
const CW_DEFAULT_ANNOTATION_BORDER = '5px solid transparent';

@Directive({
  selector: '[cwLibAnnotation]',
})
export class CwAnnotationDirective {
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly cwLibAnnotation = input.required<TAnnotation>();
  readonly cwLibAnnotationScaleX = input<number>(1);
  readonly cwLibAnnotationScaleY = input<number>(1);
  readonly cwLibAnnotationContainer = input.required<HTMLElement>();
  readonly cwLibAnnotationChanged = output<TAnnotation>();
  readonly isOverAnnotation = signal(false);

  annotationRef: ComponentRef<CwLibAnnotationComponent> | undefined;
  annotationStartPosition: ICwLibPosition = {
    top: 0,
    left: 0
  };

  constructor() {
    effect(() =>
      this.actualizeAnnotationComponentState()
    );
  }

  @HostBinding('style.border')
  get getOverAnnotationBorder(): string {
    if (!this.annotationRef)
      return CW_DEFAULT_ANNOTATION_BORDER;

    return this.isOverAnnotation()
      ? CW_OVER_ANNOTATION_BORDER
      : CW_EXISTING_ANNOTATION_BORDER;
  }

  @HostListener(`${CW_DOM_MOUSE_EVENTS.DOUBLE_CLICK}`, ['$event'])
  onDoubleClick(event: MouseEvent): void {
    if (!isString(this.cwLibAnnotation()) && this.cwLibAnnotationContainer()) {
      this.annotationStartPosition = calculateMousePositionRelativeTo(
        event,
        this.cwLibAnnotationContainer(),
        this.cwLibAnnotationScaleX(),
        this.cwLibAnnotationScaleY()
      );

      this.cwLibAnnotationChanged.emit(CW_ANNOTATION_PLACEHOLDER);
    }
  }

  private actualizeAnnotationComponentState(): void {
    if (isString(this.cwLibAnnotation())) {
      this.annotationRef ??= this.createAnnotationComponent();
    } else if (this.annotationRef) {
      this.annotationRef.destroy();
      this.annotationRef = undefined;
    }
  }

  private createAnnotationComponent(): ComponentRef<CwLibAnnotationComponent> {
    return this.viewContainerRef.createComponent(CwLibAnnotationComponent, {
      injector: Injector.create({
        providers: [{
          provide: CW_LIB_ANNOTATION_START_POSITION_TOKEN,
          useValue: this.annotationStartPosition
        }],
        parent: this.viewContainerRef.injector
      }),
      bindings: [
        inputBinding('cwLibAnnotation', this.cwLibAnnotation),
        inputBinding('cwLibAnnotationScaleX', this.cwLibAnnotationScaleX),
        inputBinding('cwLibAnnotationScaleY', this.cwLibAnnotationScaleY),
        outputBinding<TAnnotation>('cwLibAnnotationChange', (annotation) => {
          this.cwLibAnnotationChanged.emit(annotation)
          this.isOverAnnotation.set(false);
        }),
        outputBinding<boolean | undefined>('cwLibAnnotationOver', (isOver) => {
          this.isOverAnnotation.set(!!isOver);
        }),
      ]
    });
  }
}
