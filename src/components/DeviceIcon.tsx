import type { ImgHTMLAttributes } from 'react';

// NOTE:
// ✅ Do NOT import files from public folder like this.
// ✅ Files in public are served from root path '/devices/xyz.svg'.

const iconMap: Record<string, string> = {
    TemperatureDevice: '/devices/temperature.svg',
    PressureDevice: '/devices/pressure.svg',
    VolumeDevice: '/devices/volume.svg',
    PulseVolumeDevice: '/devices/pulse-volume.svg',
    PulseFlowRateDevice: '/devices/pulse-flow-rate.svg',
    FlowRateDevice: '/devices/flow-rate.svg',
    HeatingValueDevice: '/devices/heating-value.svg',
    DensityRatioDevice: '/devices/density-ratio.svg',
    WobbeIndexDevice: '/devices/wobbe-index.svg',

    // All gas/fluid types will use the generic 'gas.svg' icon
    Ho_nDevice: '/devices/gas.svg',
    RholDevice: '/devices/gas.svg',
    RhonDevice: '/devices/gas.svg',
    NitrogenDevice: '/devices/gas.svg',
    HydrogenDevice: '/devices/gas.svg',
    CarbonDioxideDevice: '/devices/gas.svg',
    MethaneDevice: '/devices/gas.svg',
    EthaneDevice: '/devices/gas.svg',
    PropaneDevice: '/devices/gas.svg',
    WaterDevice: '/devices/gas.svg',
    HydrogenSulphideDevice: '/devices/gas.svg',
    CarbonMonoxideDevice: '/devices/gas.svg',
    OxygenDevice: '/devices/gas.svg',
    KRatioDevice: '/devices/gas.svg',
    IsoButaneDevice: '/devices/gas.svg',
    NButaneDevice: '/devices/gas.svg',
    IsoPentaneDevice: '/devices/gas.svg',
    NPentaneDevice: '/devices/gas.svg',
    NHexaneDevice: '/devices/gas.svg',
    NHeptaneDevice: '/devices/gas.svg',
    NOctaneDevice: '/devices/gas.svg',
    NNonaneDevice: '/devices/gas.svg',
    NDecaneDevice: '/devices/gas.svg',
    HeliumDevice: '/devices/gas.svg',
    ArgonDevice: '/devices/gas.svg',
};

interface DeviceIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    deviceType: string;
}

const DeviceIcon = ({ deviceType, className, ...rest }: DeviceIconProps) => {
    const iconSrc = iconMap[deviceType];
    const fallbackIcon = '/devices/gas.svg';

    if (!iconSrc) {
        console.warn(`No icon found for deviceType: "${deviceType}". Using fallback.`);
    }

    return (
        <img
            src={iconSrc || fallbackIcon}
            alt={`${deviceType} icon`}
            className={className}
            {...rest}
        />
    );
};

export default DeviceIcon;
