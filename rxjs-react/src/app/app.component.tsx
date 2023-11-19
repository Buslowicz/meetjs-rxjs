import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {RouterOutlet} from '../main';

const Wrapper = styled.div`
  nav > ul {
    list-style: none;
    padding: 0;
    margin-bottom: 0;
  }

  nav > ul > li {
    display: inline-block;
    margin-right: 2em;
  }

  nav > ul > li > a {
    color: #1f2123;
    text-decoration: none;
  }
`;

export function AppComponent() {
  return (
    <Wrapper>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/draggable">Draggable</Link>
          </li>
          <li>
            <Link to="/dnd">Drag and Drop</Link>
          </li>
          <li>
            <Link to="/redux">Redux</Link>
          </li>
        </ul>
      </nav>
      <RouterOutlet/>
    </Wrapper>
  );
}
