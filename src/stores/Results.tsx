import { makeAutoObservable } from "mobx";

export class Results {
  public results: any[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  public updateResults(newResults: any) {
    this.results = newResults;
  }
}
