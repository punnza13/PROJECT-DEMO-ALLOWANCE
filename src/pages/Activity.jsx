import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { Brain, AlertTriangle, Info, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function Activity() {
  const { getAiAlerts, requests } = useWorkflow();
  const alerts = getAiAlerts();

  // Generate some mock activity logs based on actual requests for realistic timeline
  const generateMockLogs = () => {
    let logs = [];
    requests.forEach(req => {
      // Request Creation Event
      logs.push({
        id: `log-c-${req.id}`,
        type: 'created',
        message: `ยื่นคำขอเบิกโปรเจกต์ ${req.projectId} เข้าสู่ระบบ`,
        user: req.requestorName,
        time: (req.createdAt && !isNaN(new Date(req.createdAt).getTime())) 
                ? new Date(req.createdAt).toLocaleString('th-TH') 
                : new Date().toLocaleString('th-TH'),
        timestamp: (req.createdAt && !isNaN(new Date(req.createdAt).getTime()))
                ? new Date(req.createdAt).getTime()
                : new Date().getTime()
      });
      // Status update event (if not pending)
      if (req.status !== 'Pending') {
        // Add a mock offset time of +1 hour for the action
        const baseTime = (req.createdAt && !isNaN(new Date(req.createdAt).getTime())) ? new Date(req.createdAt).getTime() : new Date().getTime();
        const actionTime = new Date(baseTime + 3600000); 
        
        logs.push({
          id: `log-s-${req.id}`,
          type: req.status === 'Approved' ? 'approved' : 'rejected',
          message: `คำขอ ${req.id} ถูก${req.status === 'Approved' ? 'อนุมัติ' : 'ตีกลับ'}`,
          user: req.status === 'Approved' ? 'Project Owner' : 'System Admin',
          time: actionTime.toLocaleString('th-TH'),
          timestamp: actionTime.getTime()
        });
      }
    });

    // Sort by newest first
    logs.sort((a, b) => b.timestamp - a.timestamp);
    return logs;
  };

  const activityLogs = generateMockLogs();

  const getLogIcon = (type) => {
    switch(type) {
      case 'created': return <FileText size={20} color="#3b82f6" />; // Blue for new requests
      case 'approved': return <CheckCircle size={20} color="#10b981" />; // Green for approval
      case 'rejected': return <XCircle size={20} color="#ef4444" />; // Red for rejection
      default: return <Info size={20} color="#6b7280" />;
    }
  };

  return (
    <div style={{ padding: '32px 24px', fontFamily: "'Inter', 'Prompt', sans-serif" }}>
      
      {/* Header section */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 12px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#eef2ff', padding: '8px', borderRadius: '12px' }}>
            <Brain size={32} color="#4f46e5" />
          </div>
          AI & System Activity
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '15px' }}>
          ศูนย์รวมการแจ้งเตือนจากระบบปัญญาประดิษฐ์ (AI Alerts) และประวัติการทำรายการในระบบทั้งหมด (Audit Trail)
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '32px' }}>
        
        {/* Left Column: AI Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={22} color="#ef4444" />
            AI Insights & Alerts
          </h2>
          
          {alerts.length === 0 ? (
            <div style={{ padding: '40px 24px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 16px auto', opacity: 0.8 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-main)', margin: '0 0 8px 0' }}>ระบบปกติ</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>AI ไม่พบความผิดปกติเกี่ยวกับการเบิกจ่ายใดๆ</p>
            </div>
          ) : (
            alerts.map((alert, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderLeft: '4px solid #ef4444',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.05)',
                  transition: 'transform 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ backgroundColor: '#fee2e2', padding: '8px', borderRadius: '50%' }}>
                    <AlertTriangle size={20} color="#ef4444" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#991b1b', margin: 0 }}>
                    {alert.type}
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: '#7f1d1d', margin: 0, paddingLeft: '44px', lineHeight: '1.6' }}>
                  {alert.message}
                </p>
              </div>
            ))
          )}

          {/* Dummy AI Suggestion Card for flair */}
          <div style={{ 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: '12px', 
            padding: '24px',
            marginTop: 'auto',
            boxShadow: '0 2px 4px rgba(56, 189, 248, 0.05)'
          }}>
             <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0369a1', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={18} />
                AI Recommendation
             </h3>
             <p style={{ fontSize: '13px', color: '#0c4a6e', margin: 0, lineHeight: '1.6' }}>
               ข้อเสนอแนะ: เดือนนี้พบแพทเทิร์นการเบิกค่าวิทยากรกระจุกตัวในช่วงวันศุกร์ ควรตรวจสอบงบประมาณประจำเดือนล่วงหน้าเพื่อบริหารกระแสเงินสด
             </p>
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 32px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={22} color="#6b7280" />
            Audit Trail (System Logs)
          </h2>

          {activityLogs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginTop: '48px' }}>ยังไม่มีประวัติการทำรายการ</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {/* Vertical line connecting timeline */}
              <div style={{ position: 'absolute', top: '24px', bottom: '24px', left: '27px', width: '2px', backgroundColor: '#e5e7eb', zIndex: 0 }}></div>
              
              {activityLogs.map((log, idx) => (
                <div key={log.id} style={{ display: 'flex', gap: '24px', marginBottom: idx !== activityLogs.length - 1 ? '32px' : '0', position: 'relative', zIndex: 1 }}>
                  
                  {/* Icon Node */}
                  <div style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '50%', 
                    width: '56px', 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    {getLogIcon(log.type)}
                  </div>

                  {/* Content Bubble */}
                  <div style={{ 
                    flex: 1, 
                    backgroundColor: 'var(--bg-page)', 
                    borderRadius: '12px', 
                    padding: '20px', 
                    border: '1px solid #f3f4f6', 
                    transition: 'background-color 0.2s',
                    cursor: 'default'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                  >
                    <p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-main)', fontWeight: '500' }}>
                      {log.message}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        ดำเนินการโดย: <strong style={{ color: 'var(--text-main)' }}>{log.user}</strong>
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
