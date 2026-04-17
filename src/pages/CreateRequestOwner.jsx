import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { useNavigate } from 'react-router-dom';
import EmployeeEditModal from '../components/EmployeeEditModal';
import { Trash2, Edit2 } from 'lucide-react';

export default function CreateRequestOwner() {
  const { currentUser } = useWorkflow();
  const navigate = useNavigate();

  const [projectInfo, setProjectInfo] = useState({
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    type: ''
  });

  const [employees, setEmployees] = useState([
    { id: '2024/001', role: 'General Staff', totalAmount: 2000 }
  ]);

  const [approvalLevel, setApprovalLevel] = useState('');
  const [note, setNote] = useState('');
  const [editingEmpIdx, setEditingEmpIdx] = useState(null);

  const handleSaveModal = (updatedEmp) => {
    const newEmps = [...employees];
    newEmps[editingEmpIdx] = updatedEmp;
    setEmployees(newEmps);
    setEditingEmpIdx(null);
  };

  const calculateSubtotal = () => {
    return employees.reduce((sum, emp) => sum + (emp.totalAmount || 0), 0);
  };

  const handleAddEmployee = () => {
    const newIdx = employees.length;
    setEmployees([
      ...employees,
      { id: '', role: '', totalAmount: 0 }
    ]);
    setEditingEmpIdx(newIdx);
  };

  const handleDeleteEmployee = (idxToDelete) => {
    setEmployees(employees.filter((_, idx) => idx !== idxToDelete));
  };

  const handleSaveDraft = () => {
    alert('Draft Saved');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!approvalLevel) {
      alert('Please select an approval level.');
      return;
    }
    alert('Request Submitted for owner!');
    navigate('/dashboard');
  };

  return (
    <div className="cr-owner-container">
      <div className="cr-owner-header">
        <h1 className="cr-owner-title">สร้างคำขอเบิกจ่าย</h1>
        <div className="title-underline"></div>
      </div>

      <div className="cr-owner-layout">
        
        {/* LEFT COLUMN */}
        <div className="cr-owner-main">
          
          {/* ข้อมูล (Project Info) */}
          <div className="cr-owner-card theme-border-card">
            <h2 className="card-heading">ข้อมูล</h2>
            
            <div className="input-grid-2">
              <div className="input-group">
                <label>รหัสโครงการ</label>
                <input 
                  type="text" 
                  value={projectInfo.id} 
                  onChange={e => setProjectInfo({...projectInfo, id: e.target.value})} 
                />
              </div>
              <div className="input-group">
                <label>ชื่อโครงการ</label>
                <input 
                  type="text" 
                  value={projectInfo.name} 
                  onChange={e => setProjectInfo({...projectInfo, name: e.target.value})} 
                />
              </div>
            </div>

            <div className="input-grid-3" style={{ marginTop: '16px' }}>
              <div className="input-group">
                <label>วันที่เริ่ม</label>
                <input 
                  type="date" 
                  value={projectInfo.startDate} 
                  onChange={e => setProjectInfo({...projectInfo, startDate: e.target.value})} 
                />
              </div>
              <div className="input-group">
                <label>วันสิ้นสุดงาน</label>
                <input 
                  type="date" 
                  value={projectInfo.endDate} 
                  onChange={e => setProjectInfo({...projectInfo, endDate: e.target.value})} 
                />
              </div>
              <div className="input-group">
                <label>ประเภทโปรเจกต์</label>
                <input 
                  type="text" 
                  value={projectInfo.type} 
                  onChange={e => setProjectInfo({...projectInfo, type: e.target.value})} 
                />
              </div>
            </div>
          </div>

          {/* รายชื่อพนักงานเบิกจ่าย (Employee List) */}
          <div className="cr-owner-card grey-border-card">
            <h2 className="card-heading">รายชื่อพนักงานเบิกจ่าย</h2>
            
            <div className="tips-box">
              Tips: เพิ่มรายชื่อพนักงานทั้งหมดในโครงการนี้ ระบบจะทำการส่งอีเมลแจ้งเตือนยอดเงิน แยกรายบุคคล อัตโนมัติหลังจาก PM อนุมัติ
            </div>

            <div className="emp-list">
              {employees.map((emp, idx) => (
                <div key={idx} className="emp-card-inner">
                  <div className="emp-card-top-row">
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>รหัสพนักงาน</label>
                      <input 
                        type="text" 
                        value={emp.id} 
                        onChange={(e) => {
                          const newEmps = [...employees];
                          newEmps[idx].id = e.target.value;
                          setEmployees(newEmps);
                        }} 
                      />
                    </div>
                    <div className="input-group" style={{ flex: 2 }}>
                      <label>ชื่อ-นามสกุล</label>
                      <input 
                        type="text" 
                        value={emp.name || ''} 
                        onChange={(e) => {
                          const newEmps = [...employees];
                          newEmps[idx].name = e.target.value;
                          setEmployees(newEmps);
                        }} 
                      />
                    </div>
                    <div className="input-group" style={{ flex: 1.5 }}>
                      <label>ตำแหน่ง</label>
                      <input 
                        type="text" 
                        value={emp.role} 
                        onChange={(e) => {
                          const newEmps = [...employees];
                          newEmps[idx].role = e.target.value;
                          setEmployees(newEmps);
                        }} 
                      />
                    </div>
                    <div className="emp-actions">
                      <button className="icon-action-btn delete-btn" onClick={() => handleDeleteEmployee(idx)} title="ลดพนักงาน">
                        <Trash2 size={16} />
                      </button>
                      <button className="icon-action-btn edit-btn" onClick={() => setEditingEmpIdx(idx)} title="แก้ไขพนักงาน">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="emp-card-bottom-row">
                    <span className="note-text">* เลือกรายการเบี้ยเลี้ยงตามความเป็นจริง</span>
                    <span className="total-text">รวมเบิกของท่านนี้: ฿ {emp.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="add-emp-dashed-btn" onClick={handleAddEmployee}>
              เพิ่มพนักงาน
            </button>

          </div>

          {/* ระดับการอนุมัติ (Approval Level) */}
          <div className="cr-owner-card grey-border-card">
            <h2 className="card-heading">ระดับการอนุมัติ</h2>
            <div className="approval-buttons">
              <button 
                className={`approval-btn ${approvalLevel === 'PCO' ? 'active' : ''}`}
                onClick={() => setApprovalLevel('PCO')}
              >
                PCO<br/>อนุมัติเอง
              </button>
              <button 
                className={`approval-btn ${approvalLevel === 'PM' ? 'active' : ''}`}
                onClick={() => setApprovalLevel('PM')}
              >
                ส่ง PM<br/>อนุมัติ
              </button>
              <button 
                className={`approval-btn ${approvalLevel === 'EXEC' ? 'active' : ''}`}
                onClick={() => setApprovalLevel('EXEC')}
              >
                ผู้บริหาร
              </button>
            </div>
          </div>

          {/* หมายเหตุเพิ่มเติม (Additional Notes) */}
          <div className="cr-owner-card grey-border-card">
            <h2 className="card-heading">หมายเหตุเพิ่มเติม</h2>
            <textarea 
              className="note-textarea" 
              placeholder="ข้อความ"
              value={note}
              onChange={e => setNote(e.target.value)}
            ></textarea>
          </div>

          {/* Actions Bottom (Left Column) */}
          <div className="bottom-actions" style={{ justifyContent: 'flex-start' }}>
            <button className="btn-save-draft" onClick={handleSaveDraft}>Save Draft</button>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="cr-owner-sidebar">
          <div className="summary-black-box">
            <h3 className="summary-title" style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>Request Summary</h3>
            
            <div className="summary-row">
              <span className="s-label" style={{ color: '#9CA3AF' }}>Working Days (Mandays)</span>
              <span className="s-value" style={{ color: '#fff', fontWeight: '600' }}>0 Days</span>
            </div>
            
            <div className="summary-row">
              <span className="s-label" style={{ color: '#9CA3AF' }}>Travel Days</span>
              <span className="s-value" style={{ color: '#fff', fontWeight: '600' }}>0 Days</span>
            </div>

            <div className="summary-divider" style={{ background: '#374151', margin: '16px 0', height: '1px' }}></div>
            
            <div className="summary-row">
              <span className="s-label" style={{ color: '#9CA3AF' }}>Allowance Elements</span>
              <span className="s-value" style={{ color: '#ED4724', fontWeight: '600' }}>+ {calculateSubtotal().toLocaleString()}</span>
            </div>

            <div className="summary-divider" style={{ background: '#374151', margin: '16px 0', height: '1px' }}></div>

            <div className="summary-total-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span className="s-total-label" style={{ color: '#fff', fontSize: '18px' }}>Total Amount</span>
              <span className="s-total-value" style={{ color: '#ED4724', fontSize: '20px' }}>฿ {calculateSubtotal().toLocaleString()}</span>
            </div>

            <button className="btn-submit" onClick={handleSubmit} style={{ width: '100%', borderRadius: '8px' }}>Submit Request</button>
          </div>
        </div>

      </div>

      {editingEmpIdx !== null && (
        <EmployeeEditModal 
          employee={employees[editingEmpIdx]} 
          onSave={handleSaveModal} 
          onClose={() => setEditingEmpIdx(null)} 
        />
      )}

      <style>{`
        .cr-owner-container {
          font-family: 'Inter', Prompt, sans-serif;
          background: var(--bg-card);
          min-height: 100vh;
        }

        .cr-owner-header {
          margin-bottom: 32px;
        }

        .cr-owner-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-main);
          margin: 0;
          display: inline-block;
        }

        .title-underline {
          height: 2px;
          background: #e0e0e0;
          width: 200px;
          margin-top: 8px;
        }

        .cr-owner-layout {
          display: flex;
          align-items: flex-start;
          gap: 32px;
        }

        .cr-owner-main {
          flex: 1 1 65%;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .cr-owner-sidebar {
          flex: 1 1 35%;
        }

        .cr-owner-card {
          background: var(--bg-card);
          border-radius: 12px;
          padding: 32px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cr-owner-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }

        .theme-border-card {
          border: 1px solid #E5E7EB;
          border-top: 4px solid #ED4724;
        }

        .grey-border-card {
          border: 1px solid #E5E7EB;
        }
        
        .grey-border-card:hover {
          border-color: var(--text-main);
        }

        .card-heading {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 24px 0;
          letter-spacing: -0.3px;
        }

        .input-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .input-group input {
          width: 100%;
          border: 1px solid #E5E7EB;
          background-color: var(--bg-page);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
          color: var(--text-main);
        }
        
        .input-group input:focus {
          background: var(--bg-card);
          border-color: var(--text-main);
          box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.1);
        }

        .input-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .tips-box {
          background: var(--bg-page);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 12px;
          color: var(--text-main);
          margin-bottom: 24px;
        }

        .emp-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 16px;
        }

        .emp-card-inner {
          border: 1px solid #757575;
          border-radius: 12px;
          padding: 16px;
        }

        .emp-card-top-row {
          display: flex;
          gap: 16px;
          align-items: flex-end;
        }

        .emp-actions {
          display: flex;
          gap: 8px;
        }

        .icon-action-btn {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .icon-action-btn.edit-btn:hover {
          background: var(--bg-card);
          color: var(--text-main);
          border-color: var(--text-main);
          transform: translateY(-1px);
        }

        .icon-action-btn.delete-btn:hover {
          background: #fee2e2;
          color: #dc2626;
          border-color: #f87171;
          transform: translateY(-1px);
        }

        .emp-card-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        }

        .note-text {
          font-size: 11px;
          color: var(--text-muted);
        }

        .total-text {
          font-size: 12px;
          color: var(--text-main);
        }

        .add-emp-dashed-btn {
          width: 100%;
          padding: 14px;
          border: 2px dashed #E5E7EB;
          border-radius: 8px;
          background: transparent;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          margin-top: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .add-emp-dashed-btn:hover {
          border-color: #ED4724;
          color: #ED4724;
          background: #FFF5F2;
          transform: scale(1.01);
        }

        .approval-buttons {
          display: flex;
          gap: 16px;
        }

        .approval-btn {
          flex: 1;
          background: var(--bg-card);
          color: var(--text-muted);
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          line-height: 1.4;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .approval-btn:hover:not(.active) {
          border-color: var(--text-main);
          color: var(--text-main);
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .approval-btn.active {
          border-color: #ED4724;
          background: #ED4724;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(237, 71, 36, 0.3);
        }

        .note-textarea {
          width: 100%;
          min-height: 120px;
          background-color: var(--bg-page);
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 16px;
          font-size: 14px;
          box-sizing: border-box;
          resize: vertical;
          outline: none;
          transition: all 0.2s;
          color: var(--text-main);
        }

        .note-textarea:focus {
          background: var(--bg-card);
          border-color: var(--text-main);
          box-shadow: 0 0 0 3px rgba(17,17,17,0.1);
        }

        .note-textarea::placeholder {
          color: var(--text-muted);
        }

        .bottom-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
          padding-bottom: 40px;
        }

        .btn-save-draft {
          background: var(--bg-card);
          border: 2px solid #111;
          border-radius: 30px;
          padding: 14px 40px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          color: var(--text-main);
          min-width: 180px;
          transition: all 0.3s ease;
        }
        
        .btn-save-draft:hover {
          background: #111;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .btn-submit {
          background: #ED4724;
          border: none;
          border-radius: 30px;
          padding: 14px 40px;
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          cursor: pointer;
          min-width: 220px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-submit:hover {
          background: #D83C1C;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 24px rgba(237, 71, 36, 0.4);
        }

        /* Sidebar summary black box */
        .summary-black-box {
          background: #111111;
          border-radius: 16px;
          padding: 32px;
          color: #ffffff;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          position: sticky;
          top: 32px;
        }

        .summary-title {
          margin: 0 0 24px 0;
          font-size: 16px;
          font-weight: 700;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 12px;
          color: #aaa;
        }

        .summary-divider {
          height: 1px;
          background: #333;
          margin: 16px 0;
        }

        .summary-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .s-total-label {
          font-size: 14px;
          font-weight: 700;
        }

        .s-total-value {
          font-size: 20px;
          font-weight: 800;
        }

        .summary-empty-box {
          height: 48px;
          background: #222222;
          border-radius: 4px;
        }

      `}</style>
    </div>
  );
}
