import { makeAutoObservable } from "mobx";

class PressureFormStore {
    substitutePressure = "";
    device = "Pressure S1";
    minOpPressure = "";
    basePressure = "";
    maxOpPressure = "";
    pressureUnit = "bar";
    livePressure = "1.5 bar";

    constructor() {
        makeAutoObservable(this);
    }

    setField<K extends keyof this>(field: K, value: this[K]) {
        this[field] = value;
    }

    get formData() {
        return {
            substitutePressure: this.substitutePressure,
            device: this.device,
            minOpPressure: this.minOpPressure,
            basePressure: this.basePressure,
            maxOpPressure: this.maxOpPressure,
            pressureUnit: this.pressureUnit,
            livePressure: this.livePressure
        };
    }

    resetForm() {
        this.substitutePressure = "";
        this.device = "Pressure S1";
        this.minOpPressure = "";
        this.basePressure = "";
        this.maxOpPressure = "";
        this.pressureUnit = "bar";
    }
}

export const pressureFormStore = new PressureFormStore();