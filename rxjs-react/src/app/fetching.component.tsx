import {
  getPostsCount, Post,
  posts$,
  refinePostsData,
  refineUsersData,
  reloadPosts,
  reloadUsers, User,
  users$
} from '@buslowicz/shared';
import {useEffect, useMemo, useState} from 'react';
import {BehaviorSubject, combineLatest} from 'rxjs';
import styled from 'styled-components';

const Wrapper = styled.div`
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
`;

export function FetchingComponent() {
  const [maxPosts, setMaxPosts] = useState(10);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<(Post & { user: User })[]>([]);
  const [postsCount, setPostsCount] = useState(0);
  const {maxPosts$, selectedUser$} = useMemo(() => {
    return {
      maxPosts$: new BehaviorSubject<number>(10),
      selectedUser$: new BehaviorSubject<string | null>(null),
    };
  }, []);

  useEffect(() => maxPosts$.next(maxPosts), [maxPosts]);
  useEffect(() => selectedUser$.next(selectedUser), [selectedUser]);

  useEffect(() => {
    const subscription = combineLatest([
      users$.pipe(refineUsersData()),
      posts$.pipe(refinePostsData(selectedUser$, maxPosts$)),
      posts$.pipe(getPostsCount(selectedUser$)),
    ]).subscribe(([users, posts, postsCount]) => {
      setUsers(users);
      setPosts(posts);
      setPostsCount(postsCount);
    });
    return () => subscription.unsubscribe();
  }, [maxPosts$, selectedUser$]);

  return (
    <Wrapper>
      <h1>Fetching</h1>
      <button onClick={reloadUsers}>Reload users</button>
      <button onClick={reloadPosts}>Reload posts</button>
      <input type="range" value={maxPosts} min="1" max={postsCount} onInput={({target}) => setMaxPosts((target as HTMLInputElement).valueAsNumber)}/>
      <span>{maxPosts} / {postsCount}</span>
      <div className="lists">
        <ul className="users">
          <li>
            <button onClick={() => setSelectedUser(null)}>Reset user filter</button>
          </li>
          {users.map(user => (<li key={user.id} onClick={() => setSelectedUser(user.id)}>{user.name}</li>))}
        </ul>
        <ul className="posts">
          {posts.map(post => (<li key={post.id}>{post.title} (by {post.user.name})</li>))}
        </ul>
      </div>
    </Wrapper>
  );
}
