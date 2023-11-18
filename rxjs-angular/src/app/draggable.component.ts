import {ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {createDragHandler} from '@buslowicz/shared';
import {toSignal} from '@angular/core/rxjs-interop';
import {Subject, switchMap} from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-draggable',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .draggable {
      width: 100px;
      height: 100px;
      border-radius: 3px;
      background: red;
      cursor: move;
      position: relative;
    }
  `],
  template: `
    <h1>Draggable</h1>
    <div #ref class="draggable" [style.left.px]="position().x" [style.top.px]="position().y"></div>
  `,
})
export class DraggableComponent {
  @ViewChild('ref', {static: true}) set ref(ref: ElementRef<HTMLDivElement>) {
    this.#ref$.next(ref.nativeElement);
  }

  position = signal({x: 20, y: 20});
  #ref$ = new Subject<HTMLDivElement>();

  constructor() {
    const updatePosition = ({dx, dy}: { dx: number, dy: number }) => {
      this.position.update(({x, y}) => ({x: x + dx, y: y + dy}));
    };
    toSignal(this.#ref$.pipe(
      switchMap(element => createDragHandler(element, updatePosition))
    ))
  }
}
