import Author from "./Author";

interface AuthorAction {
  type: string,
  payload: Author[]
}

export default AuthorAction
