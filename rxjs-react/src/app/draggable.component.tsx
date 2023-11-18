import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import {createDragHandler} from '@buslowicz/shared';

const Wrapper = styled.div`
  .draggable {
    width: 100px;
    height: 100px;
    border-radius: 3px;
    background: red;
    cursor: move;
    position: relative;
  }
`;

export function DraggableComponent() {
  const [position, setPosition] = React.useState({x: 20, y: 20});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const updatePosition = ({dx, dy}: { dx: number, dy: number }) => {
      setPosition(({x, y}) => ({x: x + dx, y: y + dy}));
    };

    const subscription = createDragHandler(ref.current, updatePosition).subscribe();

    return () => subscription.unsubscribe();
  }, [ref.current]);

  return (
    <Wrapper>
      <h1>Draggable</h1>
      <div ref={ref} className="draggable" style={{left: `${position.x}px`, top: `${position.y}px`}}></div>
    </Wrapper>
  );
}
