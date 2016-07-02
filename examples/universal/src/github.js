const rehydrate$ = {}

const username$ =
  new Subject()

const userRequest$ =
  username$
    .filter(username => username != null)

const userResponse$ =
  userRequest$
    .switchMap(user => fetch(`https://api.github.com/users/${user}`))

const user$ = Observable.concat(
  rehydrate$.map(({ user }) => user),
  userResponse$
    .filter(response => response.ok)
    .switchMap(response => response.json()),
)

const reposRequest$ =
  userRequest$

const reposResponse$ =
  reposRequest$
    .switchMap(user => fetch(`https://api.github.com/users/${user}/repos`))

const repos$ = Observable.concat(
  rehydrate$.map(({ repos }) => repos),
  reposResponse$
    .filter(response => response.ok)
    .switchMap(response => response.json())
)

const dehydrate$ = Observable.combineLatest(
  user$, repos$,
  (user, repos) => ({ user, repos })
)
