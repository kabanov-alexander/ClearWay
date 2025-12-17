import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { CwRootComponent } from './app/core/root.component';

bootstrapApplication(CwRootComponent, appConfig)
  .catch((err) => console.error(err));
