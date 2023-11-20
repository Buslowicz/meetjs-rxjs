import {animationFrameScheduler, filter, finalize, fromEvent, map, switchMap, takeUntil, tap, throttleTime} from 'rxjs';

export function dndListUpdater<T extends {id: string, name: string}>(direction: 'a -> b' | 'b -> a', target: HTMLElement) {
  return (data: {listA: T[], listB: T[]}) => {
    const {listA, listB} = data;
    const [from, to] = direction === 'a -> b' ? [listA, listB] : [listB, listA];
    const itemIndex = from.findIndex(({id}) => id === target.id);
    if (itemIndex === -1) {
      return {listA, listB};
    }
    const updatedFrom = [...from];
    const item = updatedFrom.splice(itemIndex, 1).pop()!;
    const updatedTo = [...to, item];

    return direction === 'a -> b'
      ? {listA: updatedFrom, listB: updatedTo}
      : {listA: updatedTo, listB: updatedFrom};
  };
}

export function dndHandler(element: HTMLElement, callback: (item: HTMLElement) => void) {
  return fromEvent<PointerEvent>(element, 'pointerdown').pipe(
    filter(({target}) => (target as HTMLElement).hasAttribute('data-draggable')),
    switchMap(({screenX: startX, screenY: startY, target}) => {
      let translate = [0, 0];
      const targetElement = target as HTMLElement;
      const position = targetElement.getBoundingClientRect();
      const clone = targetElement.cloneNode(true) as HTMLElement;

      clone.style.cssText = `
        position: absolute;
        top: ${position.top}px;
        left: ${position.left}px;
        width: ${position.width}px;
        height: ${position.height}px;
        pointer-events: none;
      `;

      targetElement.parentElement?.appendChild(clone);

      return fromEvent<PointerEvent>(document, 'pointermove').pipe(
        throttleTime(0, animationFrameScheduler),
        map(({screenX, screenY}) => ({dx: screenX - startX, dy: screenY - startY})),
        tap(({dx, dy}) => {
          clone.style.setProperty('transform', `translate(${dx}px, ${dy}px)`);
          translate = [dx, dy];
        }),
        finalize(() => {
          clone.remove();
          const toElement = document.elementFromPoint(startX + translate[0], startY + translate[1])?.closest('[data-drop-target]');
          if (!toElement || targetElement.closest('[data-drop-target]') === toElement) {
            return;
          }
          callback(targetElement);
        }),
        takeUntil(fromEvent(document, 'pointerup')),
      );
    }),
  );
}
