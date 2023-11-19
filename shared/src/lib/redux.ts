import {scan, shareReplay, startWith, Subject} from 'rxjs';

export const configureStore = <STATE, ACTION extends { type: string, data?: unknown }>(reducer: (state: STATE, action: ACTION) => STATE, initialState: STATE) => {
  const action$ = new Subject<ACTION>();
  return {
    dispatch: (action: ACTION) => action$.next(action),
    state$: action$.pipe(
      scan(reducer, initialState),
      startWith(initialState),
      shareReplay(1)
    )
  };
}
