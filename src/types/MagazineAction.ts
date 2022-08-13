import Magazine from "./Magazine";

interface MagazineAction {
  type: string,
  payload: Magazine[]
}

export default MagazineAction
