const user$ = fetch(`https://api.github.com/users/${path.user}`)

githubApp.render({
  userStore,
  reposStore,
  commentsStore,
})
