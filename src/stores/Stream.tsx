import { makeAutoObservable } from "mobx";
import { IOCard } from "./IOCard";
import type { StreamConfig } from "../types/Stream";

export class Stream {
  public id: number;
  public config: StreamConfig;
  public ioCards: IOCard[] = [];

  constructor(id: number, config: StreamConfig) {
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
