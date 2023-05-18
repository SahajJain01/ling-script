import { Routes } from '@angular/router';

import { PromptPage } from '@pages/prompt/prompt.page'
import { HomePage } from '@pages/home/home.page'

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'prompt/:unit',
    component: PromptPage
  },
];
