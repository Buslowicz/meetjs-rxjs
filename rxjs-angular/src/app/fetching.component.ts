import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {
  getPostsCount,
  posts$,
  refinePostsData,
  refineUsersData,
  reloadPosts,
  reloadUsers,
  users$
} from '@buslowicz/shared';
import {BehaviorSubject} from 'rxjs';


@Component({
  selector: 'app-fetching',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    ul {
      list-style: none;
      padding: 0;
      max-height: 400px;
      overflow: auto;
    }

    .users {
      margin-right: 20px;
    }

    .users > li {
      cursor: pointer;
    }
    
    .posts {
      column-count: 2;
    }

    .lists {
      display: flex;
    }
  `],
  template: `
    <h1>Fetching</h1>
    <button (click)="reloadUsers()">Reload users</button>
    <button (click)="reloadPosts()">Reload posts</button>
    <input type="range" #maxPosts [value]="maxPosts$ | async" (input)="maxPosts$.next(maxPosts.valueAsNumber)" min="1"
           [max]="postsCount$ | async">
    <span>{{maxPosts$ | async}} / {{postsCount$ | async}}</span>
    <div class="lists">
      <ul class="users">
        <li>
          <button (click)="selectedUser$.next(null)">Reset user filter</button>
        </li>
        <li *ngFor="let user of users$ | async" (click)="selectedUser$.next(user.id)">
          {{user.name}}
        </li>
      </ul>
      <ul class="posts">
        <li *ngFor="let post of posts$ | async">
          {{post.title}} (by {{post.user.name}}))
        </li>
      </ul>
    </div>
  `,
})
export class FetchingComponent {
  maxPosts$ = new BehaviorSubject<number>(10);
  selectedUser$ = new BehaviorSubject<string | null>(null);

  users$ = users$.pipe(refineUsersData());
  posts$ = posts$.pipe(refinePostsData(this.selectedUser$, this.maxPosts$));
  postsCount$ = posts$.pipe(getPostsCount(this.selectedUser$));

  reloadUsers() {
    reloadUsers();
  }

  reloadPosts() {
    reloadPosts();
  }
}
