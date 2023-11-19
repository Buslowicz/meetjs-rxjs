import {MonoTypeOperatorFunction, noop, pipe, startWith, tap} from 'rxjs';

export const simpleCache = <T>(key: string, $default?: T): MonoTypeOperatorFunction<T> => {
  const cached = localStorage.getItem(key);
  return pipe(
    tap((response) => localStorage.setItem(key, JSON.stringify(response))),
    cached
      ? startWith(JSON.parse(cached))
      : $default !== undefined
        ? startWith($default)
        : tap(noop)
  );
};
