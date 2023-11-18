import {animationFrameScheduler, finalize, fromEvent, map, switchMap, takeUntil, tap, throttleTime} from "rxjs";

export function createDragHandler(element: HTMLDivElement, callback: (position: {
  dx: number,
  dy: number
}) => void) {
  return fromEvent<PointerEvent>(element, 'pointerdown').pipe(
    switchMap(({screenX: startX, screenY: startY}) => {
      let transform = [0, 0];
      return fromEvent<PointerEvent>(document, 'pointermove').pipe(
        throttleTime(0, animationFrameScheduler),
        map(({screenX, screenY}) => ({dx: screenX - startX, dy: screenY - startY})),
        tap(({dx, dy}) => {
          element.style.setProperty('transform', `translate(${dx}px, ${dy}px)`);
          transform = [dx, dy];
        }),
        finalize(() => {
          element.style.setProperty('transform', '');
          callback({dx: transform[0], dy: transform[1]});
        }),
        takeUntil(fromEvent(document, 'pointerup')),
      );
    }),
  );
}
