import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, Routes} from '@angular/router';
import {AppComponent} from './app/app.component';
import {DndComponent} from './app/dnd.component';
import {DraggableComponent} from './app/draggable.component';
import {ReduxComponent} from './app/redux.component';

const routes: Routes = [
  {
    path: 'draggable',
    component: DraggableComponent
  },
  {
    path: 'dnd',
    component: DndComponent
  },
  {
    path: 'redux',
    component: ReduxComponent
  }
];

bootstrapApplication(AppComponent, {providers: [provideRouter(routes)]})
  .catch((err) => console.error(err));
