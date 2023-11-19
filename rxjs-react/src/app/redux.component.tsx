import {configureStore} from '@buslowicz/shared';
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

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

const Wrapper = styled.div`

`;

export function ReduxComponent() {
  const [count, setCount] = useState(0);
  const store = useRef(configureStore(reducer, 0));

  const increment = () => store.current.dispatch({type: 'increment'});
  const decrement = () => store.current.dispatch({type: 'decrement'});

  useEffect(() => {
    const {state$} = store.current;
    const subscription = state$.subscribe(setCount);
    return () => subscription.unsubscribe();
  }, [store.current]);

  return (
    <Wrapper>
      <h1>Redux</h1>
      <div>
        <button onClick={decrement}>-</button>
        <span>{count}</span>
        <button onClick={increment}>+</button>
      </div>
    </Wrapper>
  );
}
