import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  styles: [`
    nav > ul {
      list-style: none;
      padding: 0;
    }

    nav > ul > li {
      display: inline-block;
      margin-right: 2em;
    }

    nav > ul > li > a {
      color: #1f2123;
      text-decoration: none;
    }
  `],
  template: `
    <nav>
      <ul>
        <li>
          <a routerLink="/">Home</a>
        </li>
        <li>
          <a routerLink="/draggable">Draggable</a>
        </li>
      </ul>
    </nav>
    <router-outlet/>
  `,
})
export class AppComponent {
  title = 'rxjs-angular';
}
