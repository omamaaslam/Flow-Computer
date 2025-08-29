import React, { useState } from "react";
import { navigationStore } from "../../stores/NavigationStore";

type ModbusRegister = {
  address: number;
  name: string;
  type: string;
  section: string;
  registerCount: number;
};

type SectionPosition = {
  x: number;
  y: number;
};

const ModbusMapping = () => {
  const [selectedRegister, setSelectedRegister] =
    useState<ModbusRegister | null>(null);
  const [sectionPositions, setSectionPositions] = useState<
    Record<string, SectionPosition>
  >({});
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [showInterfaceSettings, setShowInterfaceSettings] = useState(false);
  const [selectedFunctionCode, setSelectedFunctionCode] = useState("03");
  const [searchTerm, setSearchTerm] = useState("");
  const [interfaceSettings, setInterfaceSettings] = useState({
    baudRate: "",
    parity: "",
    dataBits: "",
    stopBits: "",
    functionCode: "03",
  });

  const modbusRegisters = [
    // Temperature Section
    {
      address: 2242,
      name: "Temperature Drag Min",
      type: "float",
      section: "Temperature",
      registerCount: 2,
    },
    {
      address: 2244,
      name: "Temperature Drag Max",
      type: "float",
      section: "Temperature",
      registerCount: 2,
    },
    {
      address: 2222,
      name: "Temperature Offset",
      type: "float",
      section: "Temperature",
      registerCount: 2,
    },
    {
      address: 2226,
      name: "Temperature Correction C0",
      type: "float",
      section: "Temperature",
      registerCount: 2,
    },
    {
      address: 2228,
      name: "Temperature Correction C1",
      type: "float",
      section: "Temperature",
      registerCount: 2,
    },
    {
      address: 2230,
      name: "Temperature Correction C2",
      type: "float",
      section: "Temperature",
      registerCount: 2,
    },
    {
      address: 2232,
      name: "Temperature Correction C3",
      type: "float",
      section: "Temperature",
      registerCount: 2,
    },

    // Pressure Section
    {
      address: 2098,
      name: "Pressure Drag Min",
      type: "float",
      section: "Pressure",
      registerCount: 2,
    },
    {
      address: 2100,
      name: "Pressure Drag Max",
      type: "float",
      section: "Pressure",
      registerCount: 2,
    },
    {
      address: 2082,
      name: "Pressure Offset",
      type: "float",
      section: "Pressure",
      registerCount: 2,
    },
    {
      address: 2086,
      name: "Pressure Correction C0",
      type: "float",
      section: "Pressure",
      registerCount: 2,
    },
    {
      address: 2088,
      name: "Pressure Correction C1",
      type: "float",
      section: "Pressure",
      registerCount: 2,
    },
    {
      address: 2090,
      name: "Pressure Correction C2",
      type: "float",
      section: "Pressure",
      registerCount: 2,
    },
    {
      address: 2092,
      name: "Pressure Correction C3",
      type: "float",
      section: "Pressure",
      registerCount: 2,
    },

    // Volume/Totalizer Section
    {
      address: 1500,
      name: "Current Volume Original",
      type: "double",
      section: "Volume",
      registerCount: 4,
    },
    {
      address: 1504,
      name: "Last Volume Original",
      type: "double",
      section: "Volume",
      registerCount: 4,
    },
    {
      address: 1508,
      name: "Operating Volume Net",
      type: "double",
      section: "Volume",
      registerCount: 4,
    },
    {
      address: 1516,
      name: "Standard Volume Net",
      type: "double",
      section: "Volume",
      registerCount: 4,
    },
    {
      address: 1544,
      name: "Interference Volume Net",
      type: "double",
      section: "Volume",
      registerCount: 4,
    },
    {
      address: 1552,
      name: "Standard Interference Volume Net",
      type: "double",
      section: "Volume",
      registerCount: 4,
    },

    // Gas Component Section
    {
      address: 3240,
      name: "Calorific Value",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3242,
      name: "Standard Density",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3244,
      name: "Relative Density",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3246,
      name: "Carbon Dioxide (CO2)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3248,
      name: "Nitrogen (N2)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3250,
      name: "Hydrogen (H2)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3252,
      name: "Methane (CH4)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3254,
      name: "Ethane (C2H6)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3256,
      name: "Propane (C3H8)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3258,
      name: "i-Butane (i-C4H10)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3260,
      name: "n-Butane (n-C4H10)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3264,
      name: "i-Pentane (i-C5H12)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3266,
      name: "n-Pentane (n-C5H12)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3268,
      name: "Hexane+ (C6H14)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3270,
      name: "Oxygen (O2)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3272,
      name: "Carbon Monoxide (CO)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3278,
      name: "Helium (He)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3280,
      name: "Argon (Ar)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3282,
      name: "Heptane (C7H16)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3284,
      name: "Octane (C8H18)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3286,
      name: "Nonane (C9H20)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3288,
      name: "Decane (C10H22)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3290,
      name: "Hydrogen Sulphide (H2S)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3292,
      name: "Water (H2O)",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3294,
      name: "Standard Air Density",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },
    {
      address: 3296,
      name: "Wobbe Index",
      type: "float",
      section: "Gas",
      registerCount: 2,
    },

    // K + Z Number Section
    {
      address: 2304,
      name: "Z Base Conditions",
      type: "float",
      section: "Calculation",
      registerCount: 2,
    },
    {
      address: 2332,
      name: "Upper Wobbe Index",
      type: "float",
      section: "Calculation",
      registerCount: 2,
    },
    {
      address: 2334,
      name: "Lower Wobbe Index",
      type: "float",
      section: "Calculation",
      registerCount: 2,
    },

    // Flow Rates
    {
      address: 9100,
      name: "Operating Flow Rate",
      type: "float",
      section: "Flow",
      registerCount: 2,
    },
    {
      address: 9102,
      name: "Standard Flow Rate",
      type: "float",
      section: "Flow",
      registerCount: 2,
    },
    {
      address: 9104,
      name: "Energy Flow Rate",
      type: "float",
      section: "Flow",
      registerCount: 2,
    },
    {
      address: 9106,
      name: "Mass Flow Rate",
      type: "float",
      section: "Flow",
      registerCount: 2,
    },

    // Operating Conditions
    {
      address: 9108,
      name: "Operating Pressure",
      type: "float",
      section: "Results",
      registerCount: 2,
    },
    {
      address: 9110,
      name: "Operating Temperature",
      type: "float",
      section: "Results",
      registerCount: 2,
    },
    {
      address: 9116,
      name: "Compressibility K",
      type: "float",
      section: "Results",
      registerCount: 2,
    },
    {
      address: 9122,
      name: "Correction Z Factor",
      type: "float",
      section: "Results",
      registerCount: 2,
    },

    // Density Values
    {
      address: 9124,
      name: "Relative Density Result",
      type: "float",
      section: "Results",
      registerCount: 2,
    },
    {
      address: 9126,
      name: "Standard Density Result",
      type: "float",
      section: "Results",
      registerCount: 2,
    },
    {
      address: 9128,
      name: "Operating Density",
      type: "float",
      section: "Results",
      registerCount: 2,
    },

    // Volume Results
    {
      address: 9140,
      name: "Original Volume",
      type: "double",
      section: "Results",
      registerCount: 4,
    },
    {
      address: 9144,
      name: "Uncorrected Volume",
      type: "double",
      section: "Results",
      registerCount: 4,
    },
    {
      address: 9148,
      name: "Operating Volume",
      type: "double",
      section: "Results",
      registerCount: 4,
    },
    {
      address: 9152,
      name: "Standard Volume",
      type: "double",
      section: "Results",
      registerCount: 4,
    },
    {
      address: 9156,
      name: "Energy Volume",
      type: "double",
      section: "Results",
      registerCount: 4,
    },
    {
      address: 9160,
      name: "Mass Volume",
      type: "double",
      section: "Results",
      registerCount: 4,
    },

    // Disturbed Volumes
    {
      address: 9164,
      name: "Disturbed Uncorrected Volume",
      type: "double",
      section: "Results",
      registerCount: 4,
    },
    {
      address: 9168,
      name: "Disturbed Operating Volume",
      type: "double",
      section: "Results",
      registerCount: 4,
    },
    {
      address: 9172,
      name: "Disturbed Standard Volume",
      type: "double",
      section: "Results",
      registerCount: 4,
    },
    {
      address: 9176,
      name: "Disturbed Energy",
      type: "double",
      section: "Results",
      registerCount: 4,
    },
    {
      address: 9180,
      name: "Disturbed Mass",
      type: "double",
      section: "Results",
      registerCount: 4,
    },

    // System Interfaces
    {
      address: 2949,
      name: "Pulse Width DO1",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 2950,
      name: "Pulse Pause DO1",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 2952,
      name: "Pulse Width DO2",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 2953,
      name: "Pulse Pause DO2",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 2955,
      name: "Pulse Width DO3",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 2956,
      name: "Pulse Pause DO3",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 2660,
      name: "Analog Output Enabled",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 2662,
      name: "Analog Output Minimum",
      type: "float",
      section: "Interface",
      registerCount: 2,
    },
    {
      address: 2664,
      name: "Analog Output Maximum",
      type: "float",
      section: "Interface",
      registerCount: 2,
    },
    {
      address: 3706,
      name: "Modbus Baud Rate",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 3707,
      name: "Modbus Parity",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 3708,
      name: "Modbus Data Bits",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 3709,
      name: "Modbus Stop Bits",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 3710,
      name: "Modbus Timeout",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },
    {
      address: 3711,
      name: "Modbus Max Slaves",
      type: "uint16",
      section: "Interface",
      registerCount: 1,
    },

    // Status Registers
    {
      address: 9184,
      name: "Status Overview",
      type: "uint16",
      section: "Status",
      registerCount: 1,
    },
    {
      address: 9186,
      name: "System Overview",
      type: "uint16",
      section: "Status",
      registerCount: 1,
    },
    {
      address: 9188,
      name: "Status 1 Overview",
      type: "uint16",
      section: "Status",
      registerCount: 1,
    },
    {
      address: 9191,
      name: "Status 2 Overview",
      type: "uint16",
      section: "Status",
      registerCount: 1,
    },
  ];

  // Filter registers based on search term
  const filteredRegisters = modbusRegisters.filter(
    (register) =>
      searchTerm === "" || register.address.toString().includes(searchTerm)
  );

  const getSectionColor = (section: string) => {
    const colors = {
      Temperature: "#ef4444",
      Pressure: "#3b82f6",
      Volume: "#10b981",
      Flow: "#f59e0b",
      Results: "#8b5cf6",
      Gas: "#06b6d4",
      Calculation: "#f97316",
      Interface: "#84cc16",
      Status: "#ec4899",
    };
    return colors[section as keyof typeof colors] || "#6b7280";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px 40px",
          borderBottom: "1px solid #e9ecef",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#333",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Modbus Mapping
        </h2>
        <div
          style={{
            position: "absolute",
            right: "40px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            onClick={() => setShowInterfaceSettings(true)}
            style={{
              backgroundColor: "#000000",
              color: "#fcc028",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Interface Settings
          </button>
          <button
            onClick={() => navigationStore.goTo("SystemSettings")}
            style={{
              backgroundColor: "#000000",
              color: "#fcc028",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" fill="#fcc028" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "40px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e9ecef",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              gap: window.innerWidth < 768 ? "20px" : "40px",
            }}
          >
            {/* Visual Diagram */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  padding: window.innerWidth < 768 ? "15px" : "30px",
                  minHeight: window.innerWidth < 768 ? "350px" : "500px",
                  border: "2px solid #e9ecef",
                  overflow: "hidden",
                }}
                onMouseMove={(e) => {
                  if (draggedSection) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;

                    setSectionPositions((prev) => ({
                      ...prev,
                      [draggedSection]: {
                        x: Math.max(8, Math.min(92, x)),
                        y: Math.max(8, Math.min(92, y)),
                      },
                    }));
                  }
                }}
                onMouseUp={() => setDraggedSection(null)}
              >
                {/* Flow Computer SVG */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: window.innerWidth < 768 ? "80px" : "120px",
                    height: window.innerWidth < 768 ? "50px" : "70px",
                    backgroundColor: "#2563eb",
                    borderRadius: window.innerWidth < 768 ? "6px" : "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: window.innerWidth < 768 ? "8px" : "11px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(37, 99, 235, 0.3)",
                    zIndex: 10,
                  }}
                >
                  Flow Computer
                </div>

                {/* Section Groups around Flow Computer */}
                {[
                  "Temperature",
                  "Pressure",
                  "Volume",
                  "Flow",
                  "Gas",
                  "Results",
                  "Interface",
                  "Status",
                ].map((section, sectionIndex) => {
                  const sectionRegisters = modbusRegisters.filter(
                    (reg) => reg.section === section
                  );

                  // Better positioning to avoid overlap
                  const positions = [
                    { x: 20, y: 20 }, // Temperature - top left
                    { x: 80, y: 20 }, // Pressure - top right
                    { x: 15, y: 50 }, // Volume - middle left
                    { x: 85, y: 50 }, // Flow - middle right
                    { x: 20, y: 80 }, // Gas - bottom left
                    { x: 80, y: 80 }, // Results - bottom right
                    { x: 50, y: 15 }, // Interface - top center
                    { x: 50, y: 85 }, // Status - bottom center
                  ];

                  const defaultPos = positions[sectionIndex] || {
                    x: 50,
                    y: 50,
                  };
                  const currentPos = sectionPositions[section] || defaultPos;
                  const groupX = currentPos.x;
                  const groupY = currentPos.y;

                  return (
                    <div key={section}>
                      {/* Section Group */}
                      <div
                        style={{
                          position: "absolute",
                          left: `${groupX}%`,
                          top: `${groupY}%`,
                          transform: "translate(-50%, -50%)",
                          backgroundColor: getSectionColor(section),
                          color: "white",
                          padding:
                            window.innerWidth < 768 ? "6px 8px" : "10px 14px",
                          borderRadius:
                            window.innerWidth < 768 ? "12px" : "20px",
                          fontSize: window.innerWidth < 768 ? "8px" : "10px",
                          fontWeight: "bold",
                          cursor:
                            draggedSection === section ? "grabbing" : "grab",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                          transition:
                            draggedSection === section ? "none" : "all 0.2s",
                          zIndex: draggedSection === section ? 30 : 20,
                          textAlign: "center",
                          minWidth: window.innerWidth < 768 ? "50px" : "75px",
                          userSelect: "none",
                        }}
                        onClick={() => setSelectedRegister(sectionRegisters[0])}
                        onMouseDown={(e) => {
                          setDraggedSection(section);
                          e.preventDefault();
                        }}
                      >
                        <div>{section}</div>
                        <div
                          style={{
                            fontSize: window.innerWidth < 768 ? "6px" : "8px",
                            opacity: 0.8,
                          }}
                        >
                          ({sectionRegisters.length})
                        </div>
                      </div>

                      {/* Connection Line to Flow Computer */}
                      <svg
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          pointerEvents: "none",
                        }}
                      >
                        <line
                          x1="50%"
                          y1="50%"
                          x2={`${groupX}%`}
                          y2={`${groupY}%`}
                          stroke={getSectionColor(section)}
                          strokeWidth="2"
                          strokeDasharray="6,3"
                          opacity="0.6"
                        />
                      </svg>

                      {/* All Registers around each section */}
                      {sectionRegisters.map((register, regIndex) => {
                        const angle =
                          regIndex *
                          (360 / sectionRegisters.length) *
                          (Math.PI / 180);
                        const radius = window.innerWidth < 768 ? 8 : 12;
                        const offsetX = Math.cos(angle) * radius;
                        const offsetY = Math.sin(angle) * radius;
                        const regX = Math.max(
                          8,
                          Math.min(92, groupX + offsetX)
                        );
                        const regY = Math.max(
                          8,
                          Math.min(92, groupY + offsetY)
                        );

                        return (
                          <div key={register.address}>
                            {/* Mini Register Node */}
                            <div
                              style={{
                                position: "absolute",
                                left: `${regX}%`,
                                top: `${regY}%`,
                                transform: "translate(-50%, -50%)",
                                backgroundColor: getSectionColor(section),
                                color: "white",
                                padding:
                                  window.innerWidth < 768
                                    ? "1px 2px"
                                    : "2px 4px",
                                borderRadius:
                                  window.innerWidth < 768 ? "4px" : "8px",
                                fontSize:
                                  window.innerWidth < 768 ? "5px" : "7px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                transition: "transform 0.2s",
                                zIndex: 15,
                                opacity: 0.7,
                                userSelect: "none",
                                minWidth:
                                  window.innerWidth < 768 ? "15px" : "20px",
                                textAlign: "center",
                              }}
                              onClick={() => setSelectedRegister(register)}
                              onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.transform =
                                  "translate(-50%, -50%) scale(1.3)";
                                (e.target as HTMLElement).style.opacity = "1";
                                (e.target as HTMLElement).style.zIndex = "25";
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.transform =
                                  "translate(-50%, -50%) scale(1)";
                                (e.target as HTMLElement).style.opacity = "0.7";
                                (e.target as HTMLElement).style.zIndex = "15";
                              }}
                            >
                              {register.address}
                            </div>

                            {/* Connection to Section Group */}
                            <svg
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                pointerEvents: "none",
                              }}
                            >
                              <line
                                x1={`${groupX}%`}
                                y1={`${groupY}%`}
                                x2={`${regX}%`}
                                y2={`${regY}%`}
                                stroke={getSectionColor(section)}
                                strokeWidth="1"
                                strokeDasharray="2,1"
                                opacity="0.4"
                              />
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Register Details */}
            <div style={{ width: window.innerWidth < 768 ? "100%" : "350px" }}>
              <h3
                style={{
                  marginBottom: "20px",
                  color: "#333",
                  fontSize: window.innerWidth < 768 ? "16px" : "18px",
                  textAlign: window.innerWidth < 768 ? "center" : "left",
                }}
              >
                Register Details
              </h3>
              {selectedRegister ? (
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    padding: window.innerWidth < 768 ? "15px" : "20px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  {/* Address - Full Width */}
                  <div
                    style={{
                      marginBottom: window.innerWidth < 768 ? "12px" : "15px",
                    }}
                  >
                    <strong
                      style={{
                        color: getSectionColor(selectedRegister.section),
                        fontSize: window.innerWidth < 768 ? "12px" : "14px",
                      }}
                    >
                      Address:
                    </strong>
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: window.innerWidth < 768 ? "16px" : "18px",
                        fontWeight: "bold",
                      }}
                    >
                      {selectedRegister.address}
                    </span>
                  </div>

                  {/* Parameter - Full Width */}
                  <div
                    style={{
                      marginBottom: window.innerWidth < 768 ? "12px" : "15px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: window.innerWidth < 768 ? "12px" : "14px",
                      }}
                    >
                      Parameter:
                    </strong>
                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: window.innerWidth < 768 ? "14px" : "16px",
                      }}
                    >
                      {selectedRegister.name}
                    </div>
                  </div>

                  {/* Horizontal Grid for Other Details */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        window.innerWidth < 768
                          ? "1fr"
                          : "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: window.innerWidth < 768 ? "12px" : "15px",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          fontSize: window.innerWidth < 768 ? "11px" : "12px",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Data Type:
                      </strong>
                      <span
                        style={{
                          backgroundColor: "#e9ecef",
                          padding:
                            window.innerWidth < 768 ? "3px 6px" : "4px 8px",
                          borderRadius: "4px",
                          fontSize: window.innerWidth < 768 ? "11px" : "12px",
                          display: "inline-block",
                        }}
                      >
                        {selectedRegister.type}
                      </span>
                    </div>

                    <div>
                      <strong
                        style={{
                          fontSize: window.innerWidth < 768 ? "11px" : "12px",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Count:
                      </strong>
                      <span
                        style={{
                          backgroundColor: "#fcc028",
                          color: "#000",
                          padding:
                            window.innerWidth < 768 ? "3px 6px" : "4px 8px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          fontSize: window.innerWidth < 768 ? "11px" : "12px",
                          display: "inline-block",
                        }}
                      >
                        {selectedRegister.registerCount}
                      </span>
                    </div>

                    <div>
                      <strong
                        style={{
                          fontSize: window.innerWidth < 768 ? "11px" : "12px",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Section:
                      </strong>
                      <span
                        style={{
                          backgroundColor: getSectionColor(
                            selectedRegister.section
                          ),
                          color: "white",
                          padding:
                            window.innerWidth < 768 ? "3px 6px" : "4px 8px",
                          borderRadius: "4px",
                          fontSize: window.innerWidth < 768 ? "10px" : "11px",
                          display: "inline-block",
                        }}
                      >
                        {selectedRegister.section}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    padding: window.innerWidth < 768 ? "15px" : "20px",
                    textAlign: "center",
                    color: "#6b7280",
                    border: "1px solid #e9ecef",
                    fontSize: window.innerWidth < 768 ? "12px" : "14px",
                  }}
                >
                  Click on a register node to view details
                </div>
              )}

              {/* Register List */}
              <div style={{ marginTop: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      color: "#333",
                      fontSize: window.innerWidth < 768 ? "14px" : "16px",
                    }}
                  >
                    All Registers
                  </h4>
                  <div
                    style={{
                      backgroundColor: "#e3f2fd",
                      color: "#1976d2",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: window.innerWidth < 768 ? "10px" : "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {searchTerm
                      ? `Found: ${filteredRegisters.length}`
                      : `Total: ${modbusRegisters.length}`}
                  </div>
                </div>

                {/* Search Input */}
                <div style={{ marginBottom: "15px" }}>
                  <input
                    type="text"
                    placeholder="Search by address"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding:
                        window.innerWidth < 768 ? "8px 12px" : "10px 14px",
                      border: "2px solid #e9ecef",
                      borderRadius: "6px",
                      fontSize: window.innerWidth < 768 ? "12px" : "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div
                  style={{
                    maxHeight: window.innerWidth < 768 ? "200px" : "300px",
                    overflowY: "auto",
                  }}
                >
                  {filteredRegisters.length === 0 && searchTerm ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#6b7280",
                        fontSize: window.innerWidth < 768 ? "12px" : "14px",
                      }}
                    >
                      No registers found matching "{searchTerm}"
                    </div>
                  ) : (
                    filteredRegisters.map((register) => (
                      <div
                        key={register.address}
                        style={{
                          padding: window.innerWidth < 768 ? "6px" : "8px",
                          marginBottom: window.innerWidth < 768 ? "4px" : "6px",
                          backgroundColor:
                            selectedRegister?.address === register.address
                              ? "#e3f2fd"
                              : "#f8f9fa",
                          borderRadius: "4px",
                          cursor: "pointer",
                          border: "1px solid #e9ecef",
                          transition: "background-color 0.2s",
                        }}
                        onClick={() => setSelectedRegister(register)}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              color: getSectionColor(register.section),
                            }}
                          >
                            {register.address}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize:
                                  window.innerWidth < 768 ? "8px" : "10px",
                                backgroundColor: "#fcc028",
                                color: "#000",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: "bold",
                              }}
                            >
                              ×{register.registerCount}
                            </span>
                            <span
                              style={{
                                fontSize:
                                  window.innerWidth < 768 ? "9px" : "11px",
                                color: "#6b7280",
                              }}
                            >
                              {register.type}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: window.innerWidth < 768 ? "10px" : "12px",
                            color: "#374151",
                            marginTop: "2px",
                          }}
                        >
                          {register.name}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Settings Modal */}
      {showInterfaceSettings && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: window.innerWidth < 768 ? "20px" : "40px",
              maxWidth: window.innerWidth < 768 ? "95%" : "700px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: window.innerWidth < 768 ? "20px" : "30px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#333",
                  fontSize: window.innerWidth < 768 ? "18px" : "24px",
                  fontWeight: "600",
                }}
              >
                Interface Settings
              </h3>
              <button
                onClick={() => setShowInterfaceSettings(false)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: window.innerWidth < 768 ? "20px" : "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "4px",
                }}
              >
                ×
              </button>
            </div>

            {/* Function Code - Full Width */}
            <div
              style={{
                marginBottom: window.innerWidth < 768 ? "16px" : "24px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#333",
                  fontSize: window.innerWidth < 768 ? "12px" : "14px",
                  fontWeight: "500",
                }}
              >
                Function Code
              </label>
              <select
                value={interfaceSettings.functionCode}
                onChange={(e) =>
                  setInterfaceSettings((prev) => ({
                    ...prev,
                    functionCode: e.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  padding: window.innerWidth < 768 ? "10px 12px" : "12px 16px",
                  border: "2px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: window.innerWidth < 768 ? "12px" : "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                <option value="03">Read Holding Registers (03)</option>
                <option value="04" disabled>
                  Read Input Registers (04)
                </option>
                <option value="01" disabled>
                  Read Coils (01)
                </option>
                <option value="02" disabled>
                  Read Discrete Inputs (02)
                </option>
              </select>
            </div>

            {/* Horizontal Grid for Other Fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  window.innerWidth < 768 ? "1fr" : "repeat(2, 1fr)",
                gap: window.innerWidth < 768 ? "16px" : "20px",
                marginBottom: window.innerWidth < 768 ? "20px" : "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: window.innerWidth < 768 ? "12px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  Baud Rate
                </label>
                <input
                  type="text"
                  value={interfaceSettings.baudRate}
                  placeholder="e.g., 9600"
                  onChange={(e) =>
                    setInterfaceSettings((prev) => ({
                      ...prev,
                      baudRate: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding:
                      window.innerWidth < 768 ? "10px 12px" : "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: window.innerWidth < 768 ? "12px" : "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: window.innerWidth < 768 ? "12px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  Parity
                </label>
                <input
                  type="text"
                  value={interfaceSettings.parity}
                  placeholder="e.g., N, E, O"
                  onChange={(e) =>
                    setInterfaceSettings((prev) => ({
                      ...prev,
                      parity: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding:
                      window.innerWidth < 768 ? "10px 12px" : "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: window.innerWidth < 768 ? "12px" : "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: window.innerWidth < 768 ? "12px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  Data Bits
                </label>
                <input
                  type="text"
                  value={interfaceSettings.dataBits}
                  placeholder="e.g., 8"
                  onChange={(e) =>
                    setInterfaceSettings((prev) => ({
                      ...prev,
                      dataBits: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding:
                      window.innerWidth < 768 ? "10px 12px" : "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: window.innerWidth < 768 ? "12px" : "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: window.innerWidth < 768 ? "12px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  Stop Bits
                </label>
                <input
                  type="text"
                  value={interfaceSettings.stopBits}
                  placeholder="e.g., 1"
                  onChange={(e) =>
                    setInterfaceSettings((prev) => ({
                      ...prev,
                      stopBits: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding:
                      window.innerWidth < 768 ? "10px 12px" : "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: window.innerWidth < 768 ? "12px" : "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: window.innerWidth < 768 ? "center" : "flex-end",
                gap: "12px",
                marginTop: window.innerWidth < 768 ? "20px" : "30px",
                paddingTop: window.innerWidth < 768 ? "16px" : "20px",
                borderTop: "1px solid #e9ecef",
                flexDirection: window.innerWidth < 768 ? "column" : "row",
              }}
            >
              <button
                onClick={() => setShowInterfaceSettings(false)}
                style={{
                  padding: window.innerWidth < 768 ? "10px 20px" : "12px 24px",
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  fontSize: window.innerWidth < 768 ? "12px" : "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  width: window.innerWidth < 768 ? "100%" : "auto",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save settings logic here
                  setShowInterfaceSettings(false);
                }}
                style={{
                  padding: window.innerWidth < 768 ? "10px 20px" : "12px 24px",
                  backgroundColor: "#000000",
                  color: "#fcc028",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: window.innerWidth < 768 ? "12px" : "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  width: window.innerWidth < 768 ? "100%" : "auto",
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModbusMapping;
