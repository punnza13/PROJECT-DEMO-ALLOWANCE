import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { CheckCircle2, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Tasks() {
  const { requests } = useWorkflow();

  // Filter to show only approved requests
  const approvedRequests = requests.filter(req => req.status === 'Approved');

  // Helper to format date
  const formatDate = (dateStr) => {
    if(!dateStr) return 'ไม่ระบุ';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ padding: '32px 24px', fontFamily: "'Inter', 'Prompt', sans-serif" }}>
      
      {/* Header section */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-main)' }}>ประวัติการอนุมัติโปรเจกต์</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>ตรวจสอบประวัติและรายละเอียดของโปรเจกต์ทั้งหมดที่ผ่านการอนุมัติ (Approve) ไปแล้ว</p>
      </div>

      {approvedRequests.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 24px', 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: '16px', 
          border: '1px dashed #d1d5db' 
        }}>
          <CheckCircle2 size={56} color="#9ca3af" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '20px', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>ยังไม่มีรายการที่อนุมัติ</h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>โปรเจกต์ที่ผ่านการอนุมัติแล้วจะมาแสดงเป็นประวัติที่นี่</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {approvedRequests.map(req => (
            <div 
              key={req.id} 
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderRadius: '16px', 
                border: '1px solid var(--border-color)', 
                padding: '24px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                transition: 'box-shadow 0.2s, transform 0.2s',
                cursor: 'default'
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              
              {/* Left Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ 
                  backgroundColor: '#dcfce7', 
                  borderRadius: '12px', 
                  width: '64px', 
                  height: '64px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={32} color="#166534" />
                </div>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <Link to={`/project/${req.projectId}`} style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', textDecoration: 'none' }}>
                      {req.projectId} {req.projectName && ` - ${req.projectName}`}
                    </Link>
                    <span style={{ 
                      backgroundColor: '#166534', 
                      color: 'var(--bg-card)', 
                      padding: '4px 12px', 
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px'
                    }}>
                      APPROVED
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <span>ผู้เบิก: <strong style={{ color: 'var(--text-main)', fontWeight: '500' }}>{req.requestorName}</strong></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarIcon size={16} />
                      {formatDate(req.startDate)} - {formatDate(req.endDate)}
                    </span>
                    <span>ยอดรวมที่อนุมัติ: <strong style={{ color: '#166534', fontWeight: 'bold' }}>฿{req.totalAmount.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>

              {/* Right Action */}
              <Link 
                to={`/project/${req.projectId}`} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: 'var(--text-main)', 
                  textDecoration: 'none', 
                  fontWeight: '600',
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                  flexShrink: 0
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
              >
                ดูรายละเอียด
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
