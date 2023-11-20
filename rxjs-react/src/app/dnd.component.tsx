import {dndHandler, dndListUpdater} from '@buslowicz/shared';
import {useEffect, useRef, useState} from 'react';
import {merge} from 'rxjs';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  user-select: none;

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
    border: 1px solid #eee;
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
`;

export function DndComponent() {
  const [data, setData] = useState({
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
  const listARef = useRef<HTMLUListElement>(null);
  const listBRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!listARef.current || !listBRef.current) {
      return;
    }

    const updateList = (direction: 'a -> b' | 'b -> a') => (target: HTMLElement) => {
      setData(dndListUpdater(direction, target));
    };

    const subscription = merge(
      dndHandler(listARef.current, updateList('a -> b')),
      dndHandler(listBRef.current, updateList('b -> a')),
    )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [listARef.current, listBRef.current]);

  return (
    <Wrapper>
      <h1>Drag and drop</h1>
      <ul ref={listARef} data-drop-target="listARef">
        {data.listA.map(item => (<li key={item.id} id={item.id} data-draggable>{item.name}</li>))}
      </ul>
      <ul ref={listBRef} data-drop-target="listBRef">
        {data.listB.map(item => (<li key={item.id} id={item.id} data-draggable>{item.name}</li>))}
      </ul>
    </Wrapper>
  );
}
