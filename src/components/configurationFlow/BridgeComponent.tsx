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
  if (interfaceName === "MOD") {
    return (
      <MODBridge
        formState={formState}
        errors={errors}
        handleStateChange={handleStateChange}
      />
    );
  }

  if (interfaceName === "HART1" || interfaceName === "HART2") {
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
