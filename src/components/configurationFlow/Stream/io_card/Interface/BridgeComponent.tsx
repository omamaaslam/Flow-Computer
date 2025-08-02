import React from "react";
import HartBridge from "./HartBridge";
import MODBridge from "./MODBridge";

interface InterfaceBridgeProps {
  interfaceName: string;
  formState: any;
  errors: any;
  handleStateChange: (field: string, value: string) => void;
}

const BridgeComponent: React.FC<InterfaceBridgeProps> = ({
  interfaceName,
  formState,
  errors,
  handleStateChange,
}) => {
  if (interfaceName === "ModbusInterface") {
    return (
      <MODBridge
        formState={formState}
        errors={errors}
        handleStateChange={handleStateChange}
      />
    );
  }

  if (interfaceName === "HartInterface") {
    return (
      <HartBridge
        formState={formState}
        errors={errors}
        handleStateChange={handleStateChange}
      />
    );
  }
  return null;
};

export default BridgeComponent;
