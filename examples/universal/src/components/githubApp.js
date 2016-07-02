import * as githubUser from './githubUser'
import * as githubRepos from './githubRepos'

export const view = store =>
  <html lang="en">
    <head>
      <title>Vulture Example: GitHub Viewer</title>
    </head>
    <body>
      {githubUser(store)}
      {githubRepos(store)}
    </body>
  </html>
