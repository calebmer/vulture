import * as githubRepo from './githubRepo'

export const view = store =>
  <div>
    {}
    {store.repos.map(repos =>
      <ul>
        {...repos.map(repo =>
          <li id={`repo-${repo.id}`}>
            {githubRepo.render(store)(repo)}
          </li>
        )}
      </ul>
    )}
  </div>

export class Model {

}
