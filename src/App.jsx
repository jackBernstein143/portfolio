console.log('App.jsx loaded'); // Add this at the top of the file

import React, { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import Grid from './components/Grid';
import { useMousePosition } from './hooks/useMousePosition';
import './App.css';

function App() {
  const mousePosition = useMousePosition();
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="app">
      <CustomCursor mousePosition={mousePosition} />
      <main className="main-content">
        <Grid />
        <footer className="footer" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <p style={{ 
            fontSize: 'clamp(0.8rem, 5cqi, 1.2rem)',
            color: '#333',
            marginBottom: showEmail ? '1rem' : '2rem'
          }}>
            If you want to see more work,{' '}
            <button
              onClick={() => setShowEmail(!showEmail)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: '2px solid #333',
                color: '#333',
                cursor: 'pointer',
                padding: '0 0 2px 0',
                font: 'inherit',
                display: 'inline'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              let me know
            </button>
          </p>

          {showEmail && (
            <div style={{
              maxWidth: '400px',
              margin: '0 auto 2rem',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                padding: '12px 16px',
                gap: '10px'
              }}>
                <span style={{
                  flex: 1,
                  fontSize: 'clamp(0.6rem, 4cqi, 0.9rem)',
                  color: '#666',
                  textAlign: 'left'
                }}>
                  jackwolfebernstein@gmail.com
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('jackwolfebernstein@gmail.com');
                    const copyIcon = document.getElementById('copy-icon');
                    if (copyIcon) {
                      copyIcon.textContent = '✓';
                      setTimeout(() => {
                        copyIcon.textContent = '📋';
                      }, 2000);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span id="copy-icon" style={{ fontSize: '1.2em' }}>📋</span>
                </button>
              </div>
            </div>
          )}

          <small style={{ opacity: 0.7, marginTop: '36px', display: 'block' }}>
            Made with care by Jack Bernstein
          </small>
        </footer>
      </main>
    </div>
  );
}

export default App;