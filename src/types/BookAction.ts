import Book from "./Book"

interface BookAction {
  type: string,
  payload: Book[]
}

export default BookAction
