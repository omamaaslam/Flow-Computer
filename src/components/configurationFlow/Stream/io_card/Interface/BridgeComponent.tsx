import React from "react";
import HartBridge from "./HartBridge";
import MODBridge from "./MODBridge";

interface InterfaceBridgeProps {
  interface_type: string;
  formState: any;
  errors: any;
  handleStateChange: (field: string, value: string) => void;
}

const BridgeComponent: React.FC<InterfaceBridgeProps> = ({
  interface_type,
  formState,
  errors,
  handleStateChange,
}) => {
  if (interface_type === "ModbusInterface") {
    return (
      <MODBridge
        formState={formState}
        errors={errors}
        handleStateChange={handleStateChange}
      />
    );
  }

  if (interface_type === "HartInterface") {
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
