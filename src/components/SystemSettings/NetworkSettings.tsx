import React, { useState } from "react";
import { navigationStore } from "../../stores/NavigationStore";

const NetworkSettings = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [defaultGateway, setDefaultGateway] = useState("");
  const [subnetMask, setSubnetMask] = useState("");
  const [dnsPrimary, setDnsPrimary] = useState("");
  const [dnsSecondary, setDnsSecondary] = useState("");
  const [hostname, setHostname] = useState("");
  const [ipMode, setIpMode] = useState("dynamic"); // "dynamic" or "static"

  // Server assigned values for dynamic mode
  const [serverValues] = useState({
    ipAddress: "192.168.1.100",
    defaultGateway: "192.168.1.1",
    subnetMask: "255.255.255.0",
    dnsPrimary: "8.8.8.8",
    dnsSecondary: "8.8.4.4",
    hostname: "flow-computer-01",
  });
  const [ipError, setIpError] = useState("");
  const [gatewayError, setGatewayError] = useState("");
  const [subnetError, setSubnetError] = useState("");
  const [dnsPrimaryError, setDnsPrimaryError] = useState("");
  const [dnsSecondaryError, setDnsSecondaryError] = useState("");
  const [hostnameError, setHostnameError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const validateIPAddress = (ip: string) => {
    const pattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return pattern.test(ip);
  };

  const handleSave = () => {
    let hasError = false;

    // Validate hostname
    if (hostname && !/^[a-zA-Z0-9-]+$/.test(hostname)) {
      setHostnameError("Please enter a valid hostname");
      hasError = true;
    } else {
      setHostnameError("");
    }

    // Validate DNS fields
    if (dnsPrimary && !validateIPAddress(dnsPrimary)) {
      setDnsPrimaryError("Please enter a valid DNS Primary address");
      hasError = true;
    } else {
      setDnsPrimaryError("");
    }

    if (dnsSecondary && !validateIPAddress(dnsSecondary)) {
      setDnsSecondaryError("Please enter a valid DNS Secondary address");
      hasError = true;
    } else {
      setDnsSecondaryError("");
    }

    // Only validate IP fields if static mode is selected
    if (ipMode === "static") {
      if (ipAddress && !validateIPAddress(ipAddress)) {
        setIpError("Please enter a valid IP address");
        hasError = true;
      } else {
        setIpError("");
      }

      if (defaultGateway && !validateIPAddress(defaultGateway)) {
        setGatewayError("Please enter a valid Default Gateway");
        hasError = true;
      } else {
        setGatewayError("");
      }

      if (subnetMask && !validateIPAddress(subnetMask)) {
        setSubnetError("Please enter a valid Subnet Mask");
        hasError = true;
      } else {
        setSubnetError("");
      }
    } else {
      // Clear errors for dynamic mode
      setIpError("");
      setGatewayError("");
      setSubnetError("");
    }

    if (!hasError) {
      setShowModal(true);
    }
  };

  const isSmallScreen = window.innerWidth < 768;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {showModal && (
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
              padding: isSmallScreen ? "20px" : "30px",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "#333",
                fontSize: isSmallScreen ? "16px" : "18px",
              }}
            >
              Settings Saved
            </h3>
            <p
              style={{
                margin: "0 0 20px 0",
                color: "#666",
                fontSize: isSmallScreen ? "12px" : "14px",
              }}
            >
              Network settings have been updated successfully.
            </p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: isSmallScreen ? "8px 16px" : "10px 20px",
                backgroundColor: "#000000",
                color: "#fcc028",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: isSmallScreen ? "12px" : "14px",
                width: isSmallScreen ? "100%" : "auto",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: "#fff",
          padding: isSmallScreen ? "15px 20px" : "20px 40px",
          borderBottom: "1px solid #e9ecef",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#333",
            fontSize: isSmallScreen ? "18px" : "24px",
            fontWeight: "600",
          }}
        >
          Network Settings
        </h2>
        <button
          onClick={() => navigationStore.goTo("SystemSettings")}
          style={{
            position: "absolute",
            right: isSmallScreen ? "20px" : "40px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "#000000",
            color: "#fcc028",
            border: "none",
            borderRadius: "6px",
            padding: isSmallScreen ? "6px 12px" : "8px 16px",
            cursor: "pointer",
            fontSize: isSmallScreen ? "11px" : "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg
            width={isSmallScreen ? "12" : "16"}
            height={isSmallScreen ? "12" : "16"}
            fill="#fcc028"
            viewBox="0 0 24 24"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back
        </button>
      </div>

      <div
        style={{
          maxWidth: isSmallScreen ? "100%" : "800px",
          margin: isSmallScreen ? "20px auto" : "40px auto",
          padding: isSmallScreen ? "0 15px" : "0 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: isSmallScreen ? "20px" : "40px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e9ecef",
          }}
        >
          <div style={{ marginBottom: isSmallScreen ? "20px" : "40px" }}>
            <div style={{ marginBottom: isSmallScreen ? "16px" : "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#333",
                  fontSize: isSmallScreen ? "12px" : "14px",
                  fontWeight: "500",
                }}
              >
                IP Configuration
              </label>
              <div style={{ display: "flex", gap: "16px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    color: "#333",
                  }}
                >
                  <input
                    type="radio"
                    name="ipMode"
                    value="dynamic"
                    checked={ipMode === "dynamic"}
                    onChange={(e) => setIpMode(e.target.value)}
                    style={{
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  />
                  Dynamic
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    color: "#333",
                  }}
                >
                  <input
                    type="radio"
                    name="ipMode"
                    value="static"
                    checked={ipMode === "static"}
                    onChange={(e) => setIpMode(e.target.value)}
                    style={{
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  />
                  Static
                </label>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isSmallScreen
                  ? "1fr"
                  : "repeat(auto-fit, minmax(250px, 1fr))",
                gap: isSmallScreen ? "16px" : "20px",
                marginBottom: isSmallScreen ? "20px" : "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  Hostname
                </label>
                <input
                  value={ipMode === "dynamic" ? "" : hostname}
                  placeholder={
                    ipMode === "static" ? "e.g., device-hostname" : ""
                  }
                  onChange={(e) => setHostname(e.target.value)}
                  disabled={ipMode === "dynamic"}
                  style={{
                    width: "100%",
                    padding: isSmallScreen ? "10px 12px" : "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: ipMode === "dynamic" ? "#f8f9fa" : "white",
                    color: ipMode === "dynamic" ? "#6c757d" : "#333",
                  }}
                />
                {hostnameError && (
                  <span
                    style={{
                      color: "#dc3545",
                      fontSize: isSmallScreen ? "10px" : "12px",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {hostnameError}
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  DNS Primary
                </label>
                <input
                  value={ipMode === "dynamic" ? "" : dnsPrimary}
                  placeholder={ipMode === "static" ? "e.g., 8.8.8.8" : ""}
                  onChange={(e) => setDnsPrimary(e.target.value)}
                  disabled={ipMode === "dynamic"}
                  style={{
                    width: "100%",
                    padding: isSmallScreen ? "10px 12px" : "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: ipMode === "dynamic" ? "#f8f9fa" : "white",
                    color: ipMode === "dynamic" ? "#6c757d" : "#333",
                  }}
                />
                {dnsPrimaryError && (
                  <span
                    style={{
                      color: "#dc3545",
                      fontSize: isSmallScreen ? "10px" : "12px",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {dnsPrimaryError}
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  DNS Secondary
                </label>
                <input
                  value={ipMode === "dynamic" ? "" : dnsSecondary}
                  placeholder={ipMode === "static" ? "e.g., 8.8.4.4" : ""}
                  onChange={(e) => setDnsSecondary(e.target.value)}
                  disabled={ipMode === "dynamic"}
                  style={{
                    width: "100%",
                    padding: isSmallScreen ? "10px 12px" : "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: ipMode === "dynamic" ? "#f8f9fa" : "white",
                    color: ipMode === "dynamic" ? "#6c757d" : "#333",
                  }}
                />
                {dnsSecondaryError && (
                  <span
                    style={{
                      color: "#dc3545",
                      fontSize: isSmallScreen ? "10px" : "12px",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {dnsSecondaryError}
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#333",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    fontWeight: "500",
                  }}
                >
                  Default Gateway
                </label>
                <input
                  value={ipMode === "dynamic" ? "" : defaultGateway}
                  placeholder={ipMode === "static" ? "e.g., 192.168.1.1" : ""}
                  onChange={(e) => setDefaultGateway(e.target.value)}
                  disabled={ipMode === "dynamic"}
                  style={{
                    width: "100%",
                    padding: isSmallScreen ? "10px 12px" : "12px 16px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: isSmallScreen ? "12px" : "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: ipMode === "dynamic" ? "#f8f9fa" : "white",
                    color: ipMode === "dynamic" ? "#6c757d" : "#333",
                  }}
                />
                {gatewayError && (
                  <span
                    style={{
                      color: "#dc3545",
                      fontSize: isSmallScreen ? "10px" : "12px",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {gatewayError}
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: isSmallScreen ? "16px" : "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isSmallScreen
                    ? "1fr"
                    : "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: isSmallScreen ? "16px" : "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#333",
                      fontSize: isSmallScreen ? "12px" : "14px",
                      fontWeight: "500",
                    }}
                  >
                    IP Address
                  </label>
                  <input
                    value={ipMode === "dynamic" ? "" : ipAddress}
                    placeholder={
                      ipMode === "static" ? "e.g., 192.168.1.100" : ""
                    }
                    onChange={(e) => setIpAddress(e.target.value)}
                    disabled={ipMode === "dynamic"}
                    style={{
                      width: "100%",
                      padding: isSmallScreen ? "10px 12px" : "12px 16px",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                      fontSize: isSmallScreen ? "12px" : "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      backgroundColor:
                        ipMode === "dynamic" ? "#f8f9fa" : "white",
                      color: ipMode === "dynamic" ? "#6c757d" : "#333",
                    }}
                  />
                  {ipError && (
                    <span
                      style={{
                        color: "#dc3545",
                        fontSize: isSmallScreen ? "10px" : "12px",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      {ipError}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#333",
                      fontSize: isSmallScreen ? "12px" : "14px",
                      fontWeight: "500",
                    }}
                  >
                    Subnet Mask
                  </label>
                  <input
                    value={ipMode === "dynamic" ? "" : subnetMask}
                    placeholder={
                      ipMode === "static" ? "e.g., 255.255.255.0" : ""
                    }
                    onChange={(e) => setSubnetMask(e.target.value)}
                    disabled={ipMode === "dynamic"}
                    style={{
                      width: "100%",
                      padding: isSmallScreen ? "10px 12px" : "12px 16px",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                      fontSize: isSmallScreen ? "12px" : "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      backgroundColor:
                        ipMode === "dynamic" ? "#f8f9fa" : "white",
                      color: ipMode === "dynamic" ? "#6c757d" : "#333",
                    }}
                  />
                  {subnetError && (
                    <span
                      style={{
                        color: "#dc3545",
                        fontSize: isSmallScreen ? "10px" : "12px",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      {subnetError}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: isSmallScreen ? "center" : "flex-end",
              paddingTop: isSmallScreen ? "16px" : "24px",
              borderTop: "1px solid #e9ecef",
            }}
          >
            <button
              onClick={handleSave}
              style={{
                padding: isSmallScreen ? "12px 24px" : "12px 24px",
                backgroundColor: "#000000",
                color: "#fcc028",
                border: "none",
                borderRadius: "8px",
                fontSize: isSmallScreen ? "12px" : "14px",
                fontWeight: "500",
                cursor: "pointer",
                width: isSmallScreen ? "100%" : "auto",
              }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSettings;
