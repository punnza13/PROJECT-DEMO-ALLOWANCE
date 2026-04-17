import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { mockUsers, login } = useWorkflow();
  const [selectedUser, setSelectedUser] = useState(mockUsers[0].id);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(selectedUser)) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-family)' }}>
      {/* Left side: branding/black */}
      <div style={{ flex: 1, backgroundColor: '#000000', display: 'flex', flexDirection: 'column', padding: '40px' }}>
         <div style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>BRAND LOGO</div>
         <div style={{ marginTop: 'auto', marginBottom: 'auto', padding: '0 40px' }}>
           <h1 style={{ color: 'white', fontSize: '48px', lineHeight: '1.2' }}>Simplify your<br/>Allowance Workflow.</h1>
         </div>
      </div>
      
      {/* Right side: Login form */}
      <div style={{ flex: 1, backgroundColor: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#000000', borderRadius: '50%', margin: '0 auto 24px' }}></div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#000000' }}>Log in to your account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Select profile to demo roles</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Employee Profile</label>
              <select 
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 20px', 
                  borderRadius: '999px', 
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  outline: 'none', 
                  fontSize: '14px',
                  color: '#000000'
                }}
              >
                {mockUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.id} - {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--accent-color)' }} />
                <span>Remember For 30 Days</span>
              </label>
              <a href="#" style={{ color: '#000000', fontWeight: '600', textDecoration: 'none' }}>Forgot password</a>
            </div>

            <button 
              type="submit" 
              style={{ 
                marginTop: '16px',
                width: '100%', 
                padding: '14px', 
                backgroundColor: 'var(--accent-color)', 
                color: 'white', 
                borderRadius: '999px', 
                fontWeight: '600', 
                fontSize: '15px', 
                transition: 'background-color 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-color-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-color)'}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
