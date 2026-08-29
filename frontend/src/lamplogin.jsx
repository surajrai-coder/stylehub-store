import React, { useState } from 'react';
import './lamplogin.css';

export default function LampLogin({ mode = 'login', onClose, onLoginSuccess, onRegisterSuccess, onAdminSuccess }) {
  const [isLampOn, setIsLampOn] = useState(false); // Default OFF rahega
  const [isPulling, setIsPulling] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');

  const handleCordPull = () => {
    setIsPulling(true);
    setTimeout(() => {
      setIsPulling(false);
      setIsLampOn((prev) => !prev);
    }, 220);
  };

  const handleGoogleAuth = () => {
    const defaultGoogleUser = {
      name: "Suraj Kumar",
      email: "ksuraj07501@gmail.com",
      phone: "+91 6284319095",
      isGoogle: true
    };
    alert("Google Sign-In Successful! Welcome, Suraj.");
    if (onLoginSuccess) {
      onLoginSuccess(defaultGoogleUser);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMode === 'login') {
      if (!email || !password) return alert("Please enter Email and Password!");
      onLoginSuccess({ email, password });
    } else if (currentMode === 'register') {
      if (!name || !email || !phone || !password) return alert("Please fill all signup fields!");
      onRegisterSuccess({ name, email, phone, password });
    } else if (currentMode === 'admin') {
      if (!adminPin) return alert("Please enter Admin Key!");
      onAdminSuccess(adminPin);
    }
  };

  return (
    <div className={`lamp-modal-backdrop ${isLampOn ? 'light-on' : 'light-off'}`}>
      {onClose && (
        <button className="lamp-close-x" onClick={onClose} title="Close">✕</button>
      )}

      <div className="lamp-interactive-stage">
        
        {/* 3D FLOOR LAMP */}
        <div className="lamp-assembly">
          <div className="lamp-dome">
            <div className="dome-cap"></div>
            
            {/* Interactive Cord */}
            <div 
              className={`lamp-pull-string ${isPulling ? 'pulled' : ''}`}
              onClick={handleCordPull}
              title="Pull to toggle light"
            >
              <div className="string-line"></div>
              <div className="string-knob"></div>
            </div>
          </div>

          <div className={`lamp-bulb-source ${isLampOn ? 'active-glow' : ''}`}></div>
          <div className={`lamp-beam-cone ${isLampOn ? 'beam-visible' : ''}`}></div>
          <div className="lamp-stand-rod"></div>
          <div className="lamp-stand-base"></div>
        </div>

        {/* AUTH CARD */}
        <div className={`lamp-auth-card ${isLampOn ? 'card-bright' : 'card-dimmed'}`}>
          <div className="card-top-title">
            <h2>
              {currentMode === 'login' ? 'Welcome Back' : currentMode === 'register' ? 'Join StyleHub' : 'Admin Security'}
            </h2>
            <p>
              {currentMode === 'login' 
                ? 'Enter your details to access your account' 
                : currentMode === 'register' 
                ? 'Create a new account for personalized fits & offers' 
                : 'Enter passcode to unlock admin controls'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {currentMode === 'register' && (
              <>
                <div className="lamp-field-box">
                  <span className="field-icon">👤</span>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="lamp-field-box">
                  <span className="field-icon">📞</span>
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                  />
                </div>
              </>
            )}

            {(currentMode === 'login' || currentMode === 'register') && (
              <>
                <div className="lamp-field-box">
                  <span className="field-icon">✉️</span>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="lamp-field-box">
                  <span className="field-icon">🔒</span>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </>
            )}

            {currentMode === 'admin' && (
              <div className="lamp-field-box" style={{ borderColor: '#f43f5e' }}>
                <span className="field-icon">🔑</span>
                <input 
                  type="password" 
                  placeholder="Enter Secret Passcode" 
                  value={adminPin} 
                  onChange={(e) => setAdminPin(e.target.value)} 
                  required 
                />
              </div>
            )}

            <button type="submit" className="lamp-submit-gold-btn">
              {currentMode === 'login' ? 'Sign In' : currentMode === 'register' ? 'Create Account' : 'Unlock Dashboard'}
            </button>
          </form>

          {currentMode !== 'admin' && (
            <>
              <div className="lamp-auth-divider">
                <span>OR CONTINUE WITH</span>
              </div>

              <div className="lamp-social-row">
                <button type="button" className="social-pill-btn" onClick={handleGoogleAuth}>
                  {/* Official Colored Google SVG Icon */}
                  <svg width="18" height="18" viewBox="0 0 48 48" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button type="button" className="social-pill-btn" onClick={() => alert("GitHub sign in connected!")}>
                  <span style={{ fontSize: '16px' }}>🐙</span>
                  <span>GitHub</span>
                </button>
              </div>
            </>
          )}

          <div className="switch-auth-link">
            {currentMode === 'login' && (
              <>Don't have an account? <span onClick={() => setCurrentMode('register')}>Sign Up</span></>
            )}
            {currentMode === 'register' && (
              <>Already have an account? <span onClick={() => setCurrentMode('login')}>Sign In</span></>
            )}
            {currentMode === 'admin' && (
              <span onClick={() => setCurrentMode('login')}>← Back to User Login</span>
            )}
          </div>
        </div>

      </div>

      <div className="lamp-switch-hint">
        💡 {isLampOn ? 'Pull golden cord to turn OFF lamp' : 'Pull the golden cord hanging from the lamp to turn ON lights!'}
      </div>
    </div>
  );
}