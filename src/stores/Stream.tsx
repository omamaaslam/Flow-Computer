import { makeAutoObservable } from "mobx";
import { IOCard } from "./IOCard";

export class Stream {
  public id: number;
  public config: any[];
  public ioCards: any[] = [];

  constructor(id: number, config: any) {
    makeAutoObservable(this);
    this.id = id;
    this.config = config;
  }

  addIOCard(cardId: number, config: any) {
    const ioCard = new IOCard(cardId, config);
    this.ioCards.push(ioCard);
    return ioCard;
  }
}
