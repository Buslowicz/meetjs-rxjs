import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {configureStore} from '@buslowicz/shared';

type Increment = { type: 'increment' };
type Decrement = { type: 'decrement' };

function reducer(state: number, action: Increment | Decrement) {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    default:
      return state;
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-redux',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Redux</h1>
    <div>
      <button (click)="decrement()">-</button>
      <span>{{count$ | async}}</span>
      <button (click)="increment()">+</button>
    </div>
  `,

})
export class ReduxComponent {
  #store = configureStore(reducer, 0);
  count$ = this.#store.state$;

  increment() {
    this.#store.dispatch({type: 'increment'});
  }

  decrement() {
    this.#store.dispatch({type: 'decrement'});
  }
}
