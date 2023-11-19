import {distinctUntilKeyChanged, shareReplay, startWith, Subject, switchMap, tap} from 'rxjs';
import {simpleCache} from './utils/simple-cache.operator';

export function fetchData<DATA>(url: string, hashKey?: keyof DATA) {
  const reload = new Subject<void>();

  return {
    reload: () => reload.next(),
    response$: reload.pipe(
      startWith(null),
      switchMap(() => fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then<DATA>(res => res.json())),
      simpleCache(url),
      hashKey ? distinctUntilKeyChanged(hashKey) : tap(),
      shareReplay(1),
    )
  }
}
