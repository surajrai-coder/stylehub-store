import React, { useState } from 'react';
import './lamplogin.css';

export default function LampLogin({ mode = 'login', onClose, onLoginSuccess, onRegisterSuccess, onAdminSuccess }) {
  const [isLampOn, setIsLampOn] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPin, setShowAdminPin] = useState(false);

  // Google Popup States
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [useAnotherGoogle, setUseAnotherGoogle] = useState(false);
  const [altGoogleEmail, setAltGoogleEmail] = useState('');

  const handleCordPull = () => {
    setIsPulling(true);
    setTimeout(() => {
      setIsPulling(false);
      setIsLampOn((prev) => !prev);
    }, 220);
  };

  const validateStrongPassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    if (!minLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      alert("⚠️ Password must be at least 8 characters long and contain uppercase (A-Z), lowercase (a-z), a number (0-9), and a special symbol (e.g., Abcd@123).");
      return false;
    }
    return true;
  };

  const handleGoogleAuthTrigger = () => {
    setUseAnotherGoogle(false);
    setAltGoogleEmail('');
    setShowGooglePopup(true);
  };

  const handleSelectGoogleAccount = (selectedEmail, selectedName) => {
    setShowGooglePopup(false);
    const googleUser = {
      name: selectedName,
      email: selectedEmail,
      phone: "+91 6284319095",
      isGoogle: true
    };
    alert(`Google Authentication Successful! Welcome, ${selectedName}`);
    if (onLoginSuccess) {
      onLoginSuccess(googleUser);
    }
  };

  const handleAltGoogleSubmit = (e) => {
    e.preventDefault();
    if (!altGoogleEmail || !altGoogleEmail.includes('@')) {
      alert("Please enter a valid Gmail address!");
      return;
    }
    handleSelectGoogleAccount(altGoogleEmail, altGoogleEmail.split('@')[0].toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMode === 'login') {
      if (!email || !password) return alert("Please enter Email and Password!");
      onLoginSuccess({ email, password });
    } else if (currentMode === 'register') {
      if (!name || !email || !phone || !password) return alert("Please fill all signup fields!");
      if (!validateStrongPassword(password)) return;
      onRegisterSuccess({ name, email, phone, password });
    } else if (currentMode === 'admin') {
      if (!adminPin) return alert("Please enter Admin Key!");
      onAdminSuccess(adminPin);
    } else if (currentMode === 'forgot') {
      if (!email) return alert("Please enter your registered email address!");
      alert(`Password reset instructions have been sent to ${email}.`);
      setCurrentMode('login');
    }
  };

  return (
    <div className={`lamp-modal-backdrop ${isLampOn ? 'light-on' : 'light-off'}`}>
      {onClose && (
        <button className="lamp-close-x" onClick={onClose} title="Close">✕</button>
      )}

      {/* INTERACTIVE GOOGLE POPUP WINDOW (Multiple Accounts Switcher) */}
      {showGooglePopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1400, padding: '16px' }}>
          <div style={{ background: '#ffffff', color: '#202124', width: '100%', maxWidth: '480px', borderRadius: '16px', padding: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', fontFamily: 'Roboto, sans-serif', position: 'relative' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <svg width="24" height="24" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span style={{ fontSize: '15px', color: '#5f6368', fontWeight: '500' }}>Sign in with Google</span>
            </div>

            {!useAnotherGoogle ? (
              <>
                <h2 style={{ fontSize: '22px', fontWeight: '400', color: '#202124', margin: '0 0 4px 0' }}>Choose an account</h2>
                <p style={{ fontSize: '13px', color: '#5f6368', margin: '0 0 20px 0' }}>to continue to <b style={{ color: '#202124' }}>My Style Hub Studio</b></p>

                {/* Account 1 */}
                <div 
                  onClick={() => handleSelectGoogleAccount("ksuraj07501@gmail.com", "Suraj Kumar")}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #dadce0', cursor: 'pointer', transition: 'background 0.2s', marginBottom: '10px' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px' }}>
                    SK
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#202124' }}>Suraj Kumar</div>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>ksuraj07501@gmail.com</div>
                  </div>
                </div>

                {/* Account 2 */}
                <div 
                  onClick={() => handleSelectGoogleAccount("mystylehubstore@gmail.com", "StyleHub Official")}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #dadce0', cursor: 'pointer', transition: 'background 0.2s', marginBottom: '16px' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f43f5e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px' }}>
                    SH
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#202124' }}>StyleHub Official</div>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>mystylehubstore@gmail.com</div>
                  </div>
                </div>

                {/* Use Another Account Option */}
                <div 
                  onClick={() => setUseAnotherGoogle(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #dadce0', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1a73e8' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '18px', width: '38px', textAlign: 'center' }}>➕</span>
                  <span>Use another account</span>
                </div>
              </>
            ) : (
              /* Use Another Account Form */
              <form onSubmit={handleAltGoogleSubmit}>
                <h2 style={{ fontSize: '20px', fontWeight: '400', color: '#202124', margin: '0 0 6px 0' }}>Sign in with Google</h2>
                <p style={{ fontSize: '13px', color: '#5f6368', margin: '0 0 18px 0' }}>Enter your Gmail address</p>

                <input 
                  type="email" 
                  placeholder="name@gmail.com" 
                  value={altGoogleEmail}
                  onChange={(e) => setAltGoogleEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #dadce0', fontSize: '14px', outline: 'none', marginBottom: '16px', color: '#202124', boxSizing: 'border-box' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button type="button" onClick={() => setUseAnotherGoogle(false)} style={{ background: 'none', border: 'none', color: '#1a73e8', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                    ← Back to accounts
                  </button>
                  <button type="submit" style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                    Next
                  </button>
                </div>
              </form>
            )}

            <button onClick={() => setShowGooglePopup(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#5f6368' }}>✕</button>
          </div>
        </div>
      )}

      <div className="lamp-interactive-stage">
        
        <div className="lamp-assembly">
          <div className="lamp-dome">
            <div className="dome-cap"></div>
            
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

        <div className={`lamp-auth-card ${isLampOn ? 'card-bright' : 'card-dimmed'}`}>
          <div className="card-top-title">
            <h2>
              {currentMode === 'login' ? 'Welcome Back' : currentMode === 'register' ? 'Join StyleHub' : currentMode === 'admin' ? 'Admin Security' : 'Reset Password'}
            </h2>
            <p>
              {currentMode === 'login' 
                ? 'Enter your credentials to access your account' 
                : currentMode === 'register' 
                ? 'Create a secure account with strong password rules' 
                : currentMode === 'admin' 
                ? 'Enter secure passcode to unlock master control' 
                : 'Recover access to your StyleHub account'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {currentMode === 'register' && (
              <>
                <div className="lamp-field-box">
                  <span className="field-icon">👤</span>
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="lamp-field-box">
                  <span className="field-icon">📞</span>
                  <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </>
            )}

            {(currentMode === 'login' || currentMode === 'register') && (
              <>
                <div className="lamp-field-box">
                  <span className="field-icon">✉️</span>
                  <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="lamp-field-box" style={{ position: 'relative' }}>
                  <span className="field-icon">🔒</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password (e.g. Abcd@123)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ paddingRight: '36px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}
                  >
                    {showPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
              </>
            )}

            {currentMode === 'forgot' && (
              <div className="lamp-field-box">
                <span className="field-icon">✉️</span>
                <input type="email" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            )}

            {currentMode === 'admin' && (
              <div className="lamp-field-box" style={{ borderColor: '#f43f5e', position: 'relative' }}>
                <span className="field-icon">🔑</span>
                <input 
                  type={showAdminPin ? "text" : "password"} 
                  placeholder="Enter Secret Passcode" 
                  value={adminPin} 
                  onChange={(e) => setAdminPin(e.target.value)} 
                  required 
                  style={{ paddingRight: '36px' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowAdminPin(!showAdminPin)}
                  style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}
                >
                  {showAdminPin ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            )}

            {currentMode === 'login' && (
              <div className="lamp-auth-options">
                <label>
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <span className="forgot-pass-btn" onClick={() => setCurrentMode('forgot')}>
                  Forgot Password?
                </span>
              </div>
            )}

            <button type="submit" className="lamp-submit-gold-btn">
              {currentMode === 'login' ? 'Log In' : currentMode === 'register' ? 'Create Account' : currentMode === 'admin' ? 'Unlock Dashboard' : 'Send Reset Link'}
            </button>
          </form>

          {/* GOOGLE BUTTON FOR BOTH LOGIN & SIGN UP */}
          {currentMode !== 'admin' && currentMode !== 'forgot' && (
            <>
              <div className="lamp-auth-divider">
                <span>OR CONTINUE WITH</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="button" className="social-pill-btn" onClick={handleGoogleAuthTrigger} style={{ width: '100%', maxWidth: '240px', padding: '11px' }}>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span style={{ fontWeight: '800' }}>Google {currentMode === 'register' ? 'Sign Up' : 'Log In'}</span>
                </button>
              </div>
            </>
          )}

          <div className="switch-auth-link">
            {currentMode === 'login' && (
              <>Don't have an account? <span onClick={() => setCurrentMode('register')}>Sign Up</span></>
            )}
            {currentMode === 'register' && (
              <>Already have an account? <span onClick={() => setCurrentMode('login')}>Log In</span></>
            )}
            {currentMode === 'admin' && (
              <span onClick={() => setCurrentMode('login')}>← Back to User Log In</span>
            )}
            {currentMode === 'forgot' && (
              <span onClick={() => setCurrentMode('login')}>← Back to Log In</span>
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