import React from "react";
import { navigationStore } from "../stores/NavigationStore";

const SystemSettings = () => {

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>


      <div style={{
        backgroundColor: '#fff',
        padding: '20px 40px',
        borderBottom: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        <h2 style={{
          margin: 0,
          color: '#333',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          System Settings
        </h2>
        <button
          onClick={() => navigationStore.goTo('Monitor')}
          style={{
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#000000',
            color: '#fcc028',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="16" height="16" fill="#fcc028" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back
        </button>
      </div>

      <div style={{
        maxWidth: '800px',
        margin: '60px auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {/* Network Settings Card */}
          <div
            onClick={() => navigationStore.goTo('NetworkSettings')}
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLDivElement;
              target.style.transform = 'translateY(-5px)';
              target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLDivElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#007bff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.86 9.14 5 13z"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '12px'
            }}>
              Network Settings
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0
            }}>
              Configure IP address, gateway, subnet mask and network parameters
            </p>
          </div>

          {/* Modbus Mapping Card */}
          <div
            onClick={() => navigationStore.goTo('ModbusMapping')}
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e9ecef',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLDivElement;
              target.style.transform = 'translateY(-5px)';
              target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLDivElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6l4 4-4 4v6l-4-4-4 4v-6l-4-4 4-4V1z"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '12px'
            }}>
              Modbus Server
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0
            }}>
              Master device can access data from these registers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;