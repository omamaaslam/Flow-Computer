import { makeAutoObservable } from "mobx";
const UNIQUE_ID_KEY = "id";

export class Results {
  results: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  updateOrAddResult(newResult: any) {
    const resultId = newResult[UNIQUE_ID_KEY];

    if (!resultId) {
      console.error(
        "Received a result without a unique ID. Cannot update.",
        newResult
      );
      return;
    }

    const existingResult = this.results.find(
      (r) => r[UNIQUE_ID_KEY] === resultId
    );

    if (existingResult) {
      Object.assign(existingResult, newResult);
    } else {
      this.results.unshift(newResult);
    }
  }
}
