import React from "react";

const Legend = () => {
  const legendItems = [
    { label: "Configured", backgroundColor: "#9BC53F", textColor: "#000000" },
    {
      label: "In-Configured",
      backgroundColor: "#C3C3C3",
      textColor: "#000000",
    },
    { label: "Alert", backgroundColor: "#FFB700", textColor: "#000000" },
    { label: "Error", backgroundColor: "#DD2C01", textColor: "#FFFFFF" },
  ];

  const legendContainerStyles: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "2.74px",
    fontFamily: "sans-serif",
  };

  const legendItemStyles: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "3.74px",
    fontSize: "10.24px",
    textAlign: "center",
    fontWeight: 600
  };

  return (
    <div style={legendContainerStyles}>
      {legendItems.map((item) => (
        <span
          key={item.label}
          style={{
            ...legendItemStyles,
            backgroundColor: item.backgroundColor,
            color: item.textColor,
          }}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
};

export default Legend;
