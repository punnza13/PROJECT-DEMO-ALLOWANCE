import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { User, Moon, Sun, Shield, Mail, Phone, MapPin } from 'lucide-react';

export default function Settings() {
  const { currentUser } = useWorkflow();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from document on mount
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setIsDarkMode(currentTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.removeAttribute('data-theme');
      setIsDarkMode(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDarkMode(true);
    }
  };

  if (!currentUser) return null; // Safety fallback

  return (
    <div style={{ padding: '32px 24px', fontFamily: "'Inter', 'Prompt', sans-serif", maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          การตั้งค่า & โปรไฟล์
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>
          จัดการข้อมูลส่วนตัวและการแสดงผลของระบบ
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '32px' }}>
        
        {/* Profile Details Card */}
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: '16px', 
          border: '1px solid var(--border-color)', 
          padding: '32px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 32px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            รายละเอียดพนักงาน (Employee Details)
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '40px' }}>
            {/* Avatar Profile */}
            <div style={{ 
              backgroundColor: 'var(--bg-page)', 
              border: '1px solid var(--border-color)',
              width: '140px', 
              height: '140px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <User size={72} color="var(--text-muted)" />
            </div>

            {/* Profile Info Form-like Grid */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h3 style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 12px 0' }}>
                {currentUser.name}
              </h3>
              <p style={{ color: 'var(--text-main)', fontSize: '16px', margin: '0 0 32px 0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                <Shield size={20} color="var(--accent-color)" />
                สิทธิ์การใช้งาน (Role): <span style={{ color: 'var(--accent-color)', backgroundColor: 'rgba(237, 71, 36, 0.1)', padding: '2px 10px', borderRadius: '4px' }}>{currentUser.role}</span>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px 0' }}>รหัสพนักงาน (ID)</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{currentUser.id}</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14}/> อีเมลองค์กร</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-main)', margin: 0 }}>contact_{currentUser.id.replace('/', '')}@company.co.th</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14}/> เบอร์ติดต่อ</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-main)', margin: 0 }}>089-XXX-XXXX</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-page)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> แผนกสังกัด</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-main)', margin: 0 }}>ส่วนปฏิบัติการส่วนกลาง (HQ)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings Card (Dark Mode) */}
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: '16px', 
          border: '1px solid var(--border-color)', 
          padding: '32px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          transition: 'all 0.3s'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
              การแสดงผล (Display Theme)
            </h2>
             <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>
               ปรับแต่งสภาพแวดล้อมระบบเป็น **ธีมมืด (Dark Mode)** เพื่อถนอมสายตา และการอ่านค่าตารางที่ง่ายขึ้นในที่แสงน้อย
             </p>
          </div>

          <button 
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: isDarkMode ? '#374151' : 'var(--bg-page)',
              border: `1px solid ${isDarkMode ? '#4b5563' : 'var(--border-color)'}`,
              borderRadius: '9999px',
              padding: '16px 32px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transform: 'scale(1)'
             }}
             onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
             onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isDarkMode ? (
               <>
                 <Moon size={22} color="#fcd34d" />
                 <span style={{ color: '#f9fafb', fontWeight: '600', fontSize: '16px' }}>Dark Mode (เปิดอยู่)</span>
               </>
            ) : (
               <>
                 <Sun size={22} color="#f59e0b" />
                 <span style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '16px' }}>เปิดโหมดกลางคืน</span>
               </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
