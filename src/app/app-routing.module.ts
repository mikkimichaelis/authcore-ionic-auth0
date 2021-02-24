import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './callback.component';

const routes: Routes = [
  { 
    path: '', loadChildren: './home/home.module#HomePageModule',
  },
  {
    path: 'callback', component: CallbackComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}