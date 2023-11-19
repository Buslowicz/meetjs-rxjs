import {StrictMode} from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, RouteProps, Routes} from 'react-router-dom';

import {AppComponent} from './app/app.component';
import {DndComponent} from './app/dnd.component';
import {DraggableComponent} from './app/draggable.component';
import {FetchingComponent} from './app/fetching.component';
import {ReduxComponent} from './app/redux.component';

const routes: Array<RouteProps> = [
  {
    path: 'draggable',
    element: <DraggableComponent/>
  },
  {
    path: 'dnd',
    element: <DndComponent/>
  },
  {
    path: 'redux',
    element: <ReduxComponent/>
  },
  {
    path: 'fetching-data',
    element: <FetchingComponent/>
  }
];

export function RouterOutlet() {
  return <Routes>
    {routes.map((route) => <Route key={route.path} {...route}></Route>)}
  </Routes>;
}

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <StrictMode>
    <BrowserRouter>
      <AppComponent/>
    </BrowserRouter>
  </StrictMode>
);
