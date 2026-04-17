import React, { createContext, useState, useContext, useEffect } from 'react';

// Mock DB
const initialRequests = [
  {
    id: 'REQ-001',
    projectId: 'PRJ-24-A01',
    requestorId: '2024/001',
    requestorName: 'Somchai (Coordinator)',
    startDate: '2026-04-01',
    endDate: '2026-04-03',
    days: [
      { date: '2026-04-01', type: 'Travel Day', amount: 500 },
      { date: '2026-04-02', type: 'Working Day', amount: 1000 },
      { date: '2026-04-03', type: 'Working Day', amount: 1000 }
    ],
    totalAmount: 2500,
    totalManday: 2, // Only working days count as mandays
    status: 'Pending', // Pending, Approved, Rejected
    createdAt: '2026-04-05T10:00:00Z',
  }
];

const mockUsers = [
  { id: '2024/001', role: 'Coordinator', name: 'Somchai (Coordinator)', mandayCountThisMonth: 15 },
  { id: '2022/045', role: 'Owner', name: 'Wichai (Project Owner)' },
  { id: '2019/012', role: 'HR', name: 'Somsri (HR Admin)' }
];

const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Not logged in initially
  const [requests, setRequests] = useState(initialRequests);
  const [evaluations, setEvaluations] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };
  
  // Login function
  const login = (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setCurrentUser(null);
  };

  // UC01: Create Request
  const createRequest = (requestData) => {
    const newReq = {
      id: `REQ-${String(requests.length + 1).padStart(3, '0')}`,
      requestorId: currentUser.id,
      requestorName: currentUser.name,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...requestData
    };
    setRequests([newReq, ...requests]);
  };

  // UC02: Approve/Reject
  const updateRequestStatus = (id, status) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status } : req));
  };

  // UC03: Submit Evaluation
  const submitEvaluation = (evalData) => {
    const newEval = {
      id: `EVL-${String(evaluations.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      ...evalData
    };
    setEvaluations([newEval, ...evaluations]);
  };

  // UC04: AI Logic (Alert Anomaly)
  const getAiAlerts = () => {
    const alerts = [];
    const groupedByUsers = {};
    
    // Group all approved requests by user
    requests.filter(r => r.status === 'Approved').forEach(req => {
      if(!groupedByUsers[req.requestorName]) groupedByUsers[req.requestorName] = 0;
      groupedByUsers[req.requestorName] += req.totalManday;
    });
    
    // Add logic for mock current month manday
    Object.keys(groupedByUsers).forEach(name => {
      const mandays = groupedByUsers[name];
      if (mandays > 10) { // Threshold for anomaly
        alerts.push({
          type: 'High Manday Anomaly',
          message: `พนักงาน ${name} มีการเบิก Manday สะสมรวม ${mandays} วัน ซึ่งสูงกว่าปกติ`
        });
      }
    });

    // Isolation Forest (Mock) - Anomaly Detection for Overwork
    // Combine base mock users and any dynamic users to form a dataset
    const dataset = [...mockUsers];
    // inject some dummy active users to make the algorithm calculation meaningful
    dataset.push({ id: '999/001', name: 'Sompong', mandayCountThisMonth: 11 });
    dataset.push({ id: '999/002', name: 'Manee', mandayCountThisMonth: 14 });
    dataset.push({ id: '999/003', name: 'Piti', mandayCountThisMonth: 13 });
    // Somchai has 15 (from mockUsers). Let's say one user has an extreme outlier value:
    dataset.push({ id: '999/004', name: 'Somsak (Outlier)', mandayCountThisMonth: 28 });

    const allMandays = dataset.map(u => u.mandayCountThisMonth || 0);
    const mean = allMandays.reduce((a,b) => a+b, 0) / allMandays.length;
    const stdDev = Math.sqrt(allMandays.reduce((a,b) => a+Math.pow(b-mean, 2), 0) / allMandays.length);

    dataset.forEach(user => {
      if(!user.mandayCountThisMonth) return;
      
      // Calculate isolation based on variance
      const zScore = Math.abs(user.mandayCountThisMonth - mean) / (stdDev || 1);
      
      // Convert to an Isolation Forest Anomaly Score format (0.5 to 1.0 indicates anomaly)
      let anomalyScore = 0.5 + (zScore * 0.15);
      anomalyScore = Math.min(anomalyScore, 0.99);

      if (anomalyScore > 0.80) { // Threshold for being heavily isolated
        alerts.push({
           type: 'Isolation Forest Anomaly',
           message: `แจ้งเตือน: ${user.name} ทำงานไปแล้ว ${user.mandayCountThisMonth} วัน (Anomaly Score: ${anomalyScore.toFixed(2)}) พบแพทเทิร์นการทำงานหนักผิดปกติที่ถูกแยกแยะ (Isolate) ออกจากกลุ่มพนักงานส่วนใหญ่อย่างชัดเจน`
        });
      }
    });

    return alerts;
  };

  return (
    <WorkflowContext.Provider value={{
      currentUser,
      mockUsers,
      login,
      logout,
      requests,
      createRequest,
      updateRequestStatus,
      evaluations,
      submitEvaluation,
      getAiAlerts,
      showToast
    }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '32px',
          right: '32px',
          backgroundColor: toast.type === 'success' ? '#10b981' : '#f43f5e',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)',
          fontWeight: '700',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '15px',
          animation: 'toastSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }}>
          <span style={{ fontSize: '20px' }}>{toast.type === 'success' ? '✅' : '⚠️'}</span>
          {toast.message}
        </div>
      )}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => useContext(WorkflowContext);
