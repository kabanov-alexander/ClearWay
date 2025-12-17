import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cw-welcome',
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CwWelcomePage {

}
