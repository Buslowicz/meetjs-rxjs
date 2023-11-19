import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {dndHandler, dndListUpdater} from '@buslowicz/shared';
import {merge, Subject, switchMap} from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dnd',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      user-select: none;
    }

    h1 {
      flex-basis: 100%;
    }

    ul {
      list-style: none;
      border: 1px solid #ccc;
      display: flex;
      width: 210px;
      padding: 0;
      align-items: center;
      flex-direction: column;
    }

    li {
      background-color: #eee;
      border-radius: 4px;
      width: 100px;
      height: 100px;
      cursor: move;
      margin: 25px;
      padding: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `],
  template: `
    <h1>Drag and drop</h1>
    <ul #listARef data-drop-target="listARef">
      <li *ngFor="let item of data().listA" [id]="item.id" data-draggable>{{item.name}}</li>
    </ul>
    <ul #listBRef data-drop-target="listBRef">
      <li *ngFor="let item of data().listB" [id]="item.id" data-draggable>{{item.name}}</li>
    </ul>
  `,
})
export class DndComponent {
  @ViewChild('listARef', {static: true}) set listARef(listARef: ElementRef<HTMLUListElement>) {
    this.#listARef$.next(listARef.nativeElement);
  }

  @ViewChild('listBRef', {static: true}) set listBRef(listBRef: ElementRef<HTMLUListElement>) {
    this.#listBRef$.next(listBRef.nativeElement);
  }

  #listARef$ = new Subject<HTMLUListElement>();
  #listBRef$ = new Subject<HTMLUListElement>();

  data = signal({
    listA: [
      {id: '1', name: 'One'},
      {id: '2', name: 'Two'},
      {id: '3', name: 'Three'},
    ],
    listB: [
      {id: '4', name: 'Four'},
      {id: '5', name: 'Five'},
      {id: '6', name: 'Six'},
    ],
  });

  constructor() {
    const updateList = (direction: 'a -> b' | 'b -> a') => (target: HTMLElement) => {
      this.data.update(dndListUpdater(direction, target));
    };

    toSignal(merge(
      this.#listARef$.pipe(switchMap(listRef => dndHandler(listRef, updateList('a -> b')))),
      this.#listBRef$.pipe(switchMap(listRef => dndHandler(listRef, updateList('b -> a'))))
    ));
  }
}
