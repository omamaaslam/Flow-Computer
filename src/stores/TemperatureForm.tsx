import { makeAutoObservable } from "mobx";

class TemperatureFormStore {
    substituteTemp = "";
    device = "Temperature S1";
    minOpTemp = "";
    baseTemp = "";
    maxOpTemp = "";
    tempUnit = "°C";
    liveTemp = "220°F (90°C)";

    constructor() {
        makeAutoObservable(this);
    }

    setField<K extends keyof this>(field: K, value: this[K]) {
        this[field] = value;
    }

    get formData() {
        return {
            substituteTemp: this.substituteTemp,
            device: this.device,
            minOpTemp: this.minOpTemp,
            baseTemp: this.baseTemp,
            maxOpTemp: this.maxOpTemp,
            tempUnit: this.tempUnit,
            liveTemp: this.liveTemp
        };
    }

    resetForm() {
        this.substituteTemp = "";
        this.device = "Temperature S1";
        this.minOpTemp = "";
        this.baseTemp = "";
        this.maxOpTemp = "";
        this.tempUnit = "°C";
    }
}

export const temperatureFormStore = new TemperatureFormStore();