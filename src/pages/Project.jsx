import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function Project() {
  const { id } = useParams();
  const { requests } = useWorkflow();
  const navigate = useNavigate();

  // Filter requests that belong to this project ID
  const projectRequests = requests.filter(req => req.projectId === id);

  const pendingRequests = projectRequests.length > 0 ? projectRequests : [];
  const totalAmount = pendingRequests.reduce((sum, req) => sum + req.totalAmount, 0);

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-page)', 
      minHeight: '100%',
      fontFamily: "'Inter', 'Prompt', sans-serif" 
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: 0, 
            paddingBottom: '8px', 
            borderBottom: '3px solid var(--border-color)', 
            display: 'inline-block', 
            minWidth: '200px',
            color: 'var(--text-main)'
          }}>
            รายการเบิก
          </h1>
        </div>
        
        <button style={{ 
          backgroundColor: '#e5e7eb', 
          color: '#000', 
          border: 'none', 
          borderRadius: '8px', 
          padding: '8px 32px', 
          fontSize: '20px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          สถานะ
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px' }}>
        
        {/* Left Card: สรุปรายการเบิกทั้งหมด */}
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '12px', 
          padding: '32px' 
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '32px', color: 'var(--text-main)' }}>สรุปรายการเบิกทั้งหมด</h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ paddingBottom: '16px', fontWeight: '600', fontSize: '16px', color: 'var(--text-main)' }}>พนักงาน</th>
                <th style={{ paddingBottom: '16px', fontWeight: '600', fontSize: '16px', color: 'var(--text-main)' }}>รายการ</th>
                <th style={{ paddingBottom: '16px', fontWeight: '600', fontSize: '16px', color: 'var(--text-main)', minWidth: '160px' }}>ยอด สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req, idx) => (
                <tr key={req.id || idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)' }}>{req.requestorName || 'สมชาย วงศ์ไทย'}</td>
                  <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)' }}>ค่าวิทยากร 3 ชม.</td>
                  <td style={{ padding: '16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ minWidth: '60px', color: 'var(--text-main)' }}>฿{req.totalAmount ? req.totalAmount.toLocaleString() : '3,000'}</span>
                    <span style={{ 
                      backgroundColor: '#fcd34d', 
                      color: 'var(--bg-card)', 
                      padding: '4px 16px', 
                      borderRadius: '9999px',
                      fontSize: '14px',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }}>
                      รออนุมัติ
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Default Mock Rows if Empty */}
              {pendingRequests.length === 0 && [1,2,3,4].map((item) => (
                <tr key={item} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)' }}>สมชาย วงศ์ไทย</td>
                  <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)' }}>ค่าวิทยากร 3 ชม.</td>
                  <td style={{ padding: '16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ minWidth: '60px', color: 'var(--text-main)' }}>฿3,000</span>
                    <span style={{ 
                      backgroundColor: '#fcd34d', 
                      color: 'var(--bg-card)', 
                      padding: '4px 16px', 
                      borderRadius: '9999px',
                      fontSize: '14px',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }}>
                      รออนุมัติ
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Total Row */}
              <tr>
                <td style={{ padding: '24px 0 8px 0', fontSize: '16px', fontWeight: '500', color: 'var(--text-main)' }}>ยอดรวม</td>
                <td style={{ padding: '24px 0 8px 0', fontSize: '16px' }}></td>
                <td style={{ padding: '24px 0 8px 0', fontSize: '16px', color: 'var(--text-main)' }}>
                  ฿{totalAmount ? totalAmount.toLocaleString() : '12,000'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Right Card: การส่งอนุมัติ */}
          <div style={{ 
            backgroundColor: 'var(--text-main)', 
            color: 'var(--bg-card)', 
            borderRadius: '12px', 
            padding: '32px',
            flex: 1
          }}>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '12px' }}>การส่งอนุมัติ</h2>
            <p style={{ fontSize: '13px', color: '#d1d5db', marginBottom: '32px', fontWeight: '300' }}>
              โปรเจกต์นี้ต้องผ่านการอนุมัติจาก PM ก่อนส่ง HR
            </p>
            
            <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>ส่งถึง</p>
            <div style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderRadius: '9999px', 
              padding: '6px 16px', 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px',
              maxWidth: '80%'
            }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                backgroundColor: '#d1d5db', 
                borderRadius: '50%' 
              }}></div>
              <span style={{ color: '#000', fontSize: '14px', fontWeight: '500' }}>ชื่อ</span>
            </div>
          </div>

          {/* Bottom Right Card: เมื่ออนุมัติแล้ว */}
          <div style={{ 
            backgroundColor: 'var(--text-main)', 
            color: 'var(--bg-card)', 
            borderRadius: '12px', 
            padding: '32px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: 'auto' }}>เมื่ออนุมัติแล้ว</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '32px' }}>
              <button style={{ 
                backgroundColor: 'transparent',
                color: 'var(--bg-card)',
                border: '1px solid #fff',
                borderRadius: '9999px',
                padding: '16px 32px',
                fontSize: '22px',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '16px',
                width: '90%',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
              >
                Export CSV ส่ง HR
              </button>
              
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: '300' }}>
                ระบบจะแจ้งเตือนพนักงานอัตโนมัติ
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
