import { RouterModule } from '@angular/router';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component, ComponentRef,
  ElementRef,
  inject,
  viewChild
} from '@angular/core';

@Component({
  selector: 'cw-root',
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class CwRootComponent {
  private readonly appRef = inject(ApplicationRef);
  private readonly rootActions = viewChild<ElementRef<HTMLElement>>('toolbar');

  private rootActionsRef: ComponentRef<unknown> | undefined;

  addRootActions<TComponent>(
    createComponentFn: (hostElement: HTMLDivElement) => ComponentRef<TComponent>
  ): void {
    const host = document.createElement('div');

    this.rootActionsRef = createComponentFn(host);

    this.appRef.attachView(this.rootActionsRef.hostView);

    this.rootActions()?.nativeElement.appendChild(host);
  }

  removeRootActions(): void {
    this.rootActionsRef?.destroy();
  }
}
