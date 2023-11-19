import {combineLatestWith, map, Observable, pipe} from 'rxjs';
import {fetchData} from './data-fetching';

export interface User {
  __hash: string;
  id: string;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  },
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Post {
  __hash: string;
  id: string;
  userId: string;
  title: string;
  body: string;
}

type UsersAPIResponse = Record<string, User> | { __hash: string };
type PostsApiResponse = Record<string, Post> | { __hash: string };

export const {response$: users$, reload: reloadUsers} = fetchData<UsersAPIResponse>('http://localhost:8080/users', '__hash');
export const {response$: posts$, reload: reloadPosts} = fetchData<PostsApiResponse>('http://localhost:8080/posts', '__hash');

export function refineUsersData() {
  return map((users: UsersAPIResponse) => Object.values(users).filter(value => typeof value !== 'string') as User[]);
}

export function refinePostsData(selectedUser$: Observable<string | null>, maxPosts$: Observable<number>) {
  return pipe(
    map((posts: PostsApiResponse) => Object.values(posts).filter(value => typeof value !== 'string') as Post[]),
    combineLatestWith(users$ as Observable<Record<string, User>>),
    map(([posts, users]) => posts.map(post => ({
      ...post, user: users[post.userId],
    }))),
    combineLatestWith(selectedUser$, maxPosts$),
    map(([posts, selectedUser, maxPosts]) => posts
      .filter(post => !selectedUser || post.userId === selectedUser)
      .slice(0, maxPosts)
    ),
  );
}

export function getPostsCount(selectedUser$: Observable<string | null>) {
  return pipe(
    map((posts: PostsApiResponse) => Object.values(posts).filter(value => typeof value !== 'string') as Post[]),
    combineLatestWith(selectedUser$),
    map(([posts, selectedUser]) => posts.filter(post => !selectedUser || post.userId === selectedUser).length),
  );
}
