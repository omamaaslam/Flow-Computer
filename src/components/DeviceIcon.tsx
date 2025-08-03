import type { ImgHTMLAttributes } from 'react';

// --- CORRECTED IMPORTS ---
// Corrected 'densityratio.svg' to 'density-ratio.svg'
import densityRatioIcon from '../assets/devices/density-ratio.svg';
// This import is correct. Make sure your file is named 'flow-rate.svg' and not 'fow-rate.svg'.
import flowRateIcon from '../../public/devices/fow-rate.svg';
import gasIcon from '../../public/devices/gas.svg';
import heatingValueIcon from '../../public/devices/heating-value.svg';
import pressureIcon from '../../public/devices/pressure.svg';
import pulseFlowRateIcon from '../../public/devices/pulse-flow-rate.svg';
import pulseVolumeIcon from '../../public/devices/pulse-volume.svg';
import temperatureIcon from '../../public/devices/temperature.svg';
import volumeIcon from '../../public/devices/volume.svg';
import wobbeIndexIcon from '../../public/devices/wobbe-index.svg';

const iconMap: Record<string, string> = {
    TemperatureDevice: temperatureIcon,
    PressureDevice: pressureIcon,
    VolumeDevice: volumeIcon,
    PulseVolumeDevice: pulseVolumeIcon,
    PulseFlowRateDevice: pulseFlowRateIcon,
    FlowRateDevice: flowRateIcon,
    HeatingValueDevice: heatingValueIcon,
    DensityRatioDevice: densityRatioIcon,
    WobbeIndexDevice: wobbeIndexIcon,

    // --- All gas/fluid types will use the generic 'gas.svg' icon ---
    Ho_nDevice: gasIcon,
    RholDevice: gasIcon,
    RhonDevice: gasIcon,
    NitrogenDevice: gasIcon,
    HydrogenDevice: gasIcon,
    CarbonDioxideDevice: gasIcon,
    MethaneDevice: gasIcon,
    EthaneDevice: gasIcon,
    PropaneDevice: gasIcon,
    WaterDevice: gasIcon,
    HydrogenSulphideDevice: gasIcon,
    CarbonMonoxideDevice: gasIcon,
    OxygenDevice: gasIcon,
    KRatioDevice: gasIcon,
    IsoButaneDevice: gasIcon,
    NButaneDevice: gasIcon,
    IsoPentaneDevice: gasIcon,
    NPentaneDevice: gasIcon,
    NHexaneDevice: gasIcon,
    NHeptaneDevice: gasIcon,
    NOctaneDevice: gasIcon,
    NNonaneDevice: gasIcon,
    NDecaneDevice: gasIcon,
    HeliumDevice: gasIcon,
    ArgonDevice: gasIcon,
};

// Define the component's props. It will accept any standard <img> attribute.
interface DeviceIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    deviceType: string;
}

const DeviceIcon = ({ deviceType, className, ...rest }: DeviceIconProps) => {
    // Look up the icon source in our map.
    const iconSrc = iconMap[deviceType];

    // If a device type is not found in the map, use the generic gas icon as a fallback.
    const fallbackIcon = gasIcon;

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