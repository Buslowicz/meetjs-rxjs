import {configureStore} from '@buslowicz/shared';
import {useEffect, useMemo, useState} from 'react';
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
  const store = useMemo(() => configureStore(reducer, 0), []);

  const increment = () => store.dispatch({type: 'increment'});
  const decrement = () => store.dispatch({type: 'decrement'});

  useEffect(() => {
    const {state$} = store;
    const subscription = state$.subscribe(setCount);
    return () => subscription.unsubscribe();
  }, [store]);

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
