import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2, X, PlusCircle } from 'lucide-react';
import CreateRequestOwner from './CreateRequestOwner';

export default function CreateRequest() {
  const { createRequest, currentUser } = useWorkflow();
  const navigate = useNavigate();

  const THEME_COLOR = '#ED4724';
  const RATE_W = 1000;
  const RATE_T = 500;
  const SPEAKER_RATE = 600;

  if (currentUser?.role === 'Owner') {
    return <CreateRequestOwner />;
  }

  // Selected Employee Info (from Modal)
  const [employee, setEmployee] = useState({
    name: currentUser?.name || 'Tatapendek D.',
    id: currentUser?.id || '2024/001',
    role: 'General Staff',
    department: 'Technology'
  });
  
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ ...employee });

  const [formData, setFormData] = useState({
    projectId: '',
    dayType: 'Working Day',
    role: 'General',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const [calcResult, setCalcResult] = useState({
    mandays: 0,
    travelDays: 0,
    speakerHours: 0,
    totalBase: 0,
    totalSpeaker: 0,
    grandTotal: 0
  });

  // Table State
  const initialTableState = {
    onsiteDuration1: false, onsiteDuration2: false, onsiteAdd1: false, onsiteAdd2: false, onsiteAdd3: false, onsiteLoc1: false, onsiteLoc2: false, onsiteHol1: false, onsiteHol2: false,
    travelOut1: false, travelOut2: false, travelOut3: false, travelRet1: false, travelRet2: false, travelRet3: false,
  };

  const [tableChecks, setTableChecks] = useState({
    ...initialTableState,
    onsiteDuration1: true,
    onsiteAdd2: true,
    onsiteLoc1: true
  });
  
  const [tableTotal, setTableTotal] = useState(0);
  const [isAlert, setIsAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCheck = (field) => {
    setTableChecks(prev => {
      const category = field.replace(/\d+$/, '');
      const newState = { ...prev };
      const isCurrentlyChecked = prev[field];

      if (!isCurrentlyChecked) {
        Object.keys(newState).forEach(key => {
          if (key !== field && key.replace(/\d+$/, '') === category) {
            newState[key] = false;
          }
        });
      }

      newState[field] = !isCurrentlyChecked;
      return newState;
    });
  };

  const clearTableRow = () => {
    setTableChecks(initialTableState);
  };

  useEffect(() => {
    let sum = 0;
    if(tableChecks.onsiteDuration1) sum += 150;
    if(tableChecks.onsiteDuration2) sum += 250;
    if(tableChecks.onsiteAdd1) sum += 100;
    if(tableChecks.onsiteAdd2) sum += 100;
    if(tableChecks.onsiteAdd3) sum += 100;
    if(tableChecks.onsiteLoc1) sum += 200;
    if(tableChecks.onsiteLoc2) sum += 300;
    if(tableChecks.onsiteHol1) sum += 600;
    if(tableChecks.onsiteHol2) sum += 1000;
    
    if(tableChecks.travelOut1) sum += 200;
    if(tableChecks.travelOut2) sum += 300;
    if(tableChecks.travelOut3) sum += 500;
    if(tableChecks.travelRet1) sum += 100;
    if(tableChecks.travelRet2) sum += 200;
    if(tableChecks.travelRet3) sum += 400;

    setTableTotal(sum);
  }, [tableChecks]);

  useEffect(() => {
    calculateTotal();
  }, [formData, tableTotal]);

  const getWorkingDays = (start, end) => {
    if (!start || !end) return 0;
    let s = new Date(start);
    let e = new Date(end);
    if (s > e) return 0;
    
    let count = 0;
    let curDate = new Date(s);
    while (curDate <= e) {
      let day = curDate.getDay();
      if (day !== 0 && day !== 6) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  };

  const getTotalDays = (start, end) => {
    if (!start || !end) return 0;
    let s = new Date(start);
    let e = new Date(end);
    if (s > e) return 0;
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateHours = (startStr, endStr) => {
    if (!startStr || !endStr) return 0;
    const [startH, startM] = startStr.split(':');
    const [endH, endM] = endStr.split(':');
    const start = new Date(1970, 0, 1, +startH, +startM);
    const end = new Date(1970, 0, 1, +endH, +endM);
    let hours = (end - start) / (1000 * 60 * 60);
    return hours > 0 ? hours : 0;
  };

  const calculateTotal = () => {
    let mandays = 0;
    let travelDays = 0;

    if (formData.dayType === 'Working Day') {
      mandays = getWorkingDays(formData.startDate, formData.endDate);
    } else if (formData.dayType === 'Travel Day') {
      travelDays = getTotalDays(formData.startDate, formData.endDate);
    }

    let speakerHours = 0;
    let totalSpeaker = 0;
    if (formData.role === 'Main Speaker') {
      speakerHours = calculateHours(formData.startTime, formData.endTime);
      totalSpeaker = speakerHours * SPEAKER_RATE;
    }

    const totalBase = (mandays * RATE_W) + (travelDays * RATE_T);
    const grandTotal = totalBase + totalSpeaker + tableTotal;

    setCalcResult({
      mandays,
      travelDays,
      speakerHours,
      totalBase,
      totalSpeaker,
      grandTotal
    });

    if (mandays > 5) {
      setIsAlert(true);
    } else {
      setIsAlert(false);
    }
  };

  const handleModalSave = () => {
    setEmployee(modalData);
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAlert) {
      alert('WARNING: AI Alert Triggered! Form submission requires manual HR override.');
    }
    
    // Using original context logic
    createRequest({
      projectId: formData.projectId || 'N/A',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || new Date().toISOString().split('T')[0],
      requestorName: employee.name,
      requestorId: employee.id,
      totalAmount: calcResult.grandTotal,
      totalManday: calcResult.mandays || 1, // fallback so we don't break old table ui
      days: []
    });

    navigate('/dashboard');
  };

  return (
    <div className="cr-container">
      <div className="cr-header">
        <h1 className="cr-title">Create Request</h1>
        <div className="cr-breadcrumb">Dashboard / Allowance / Create Request</div>
      </div>

      <div className="cr-layout">
        
        {/* Main Form Content */}
        <div className="cr-main-column">

          {/* Employee Card */}
          <div className="cr-card">
            <div className="cr-card-header">
              <h2 className="cr-card-title">Employee Information</h2>
              <button className="cr-edit-btn" onClick={() => setShowModal(true)}>
                <Edit2 size={14} /> แก้ไข (Edit)
              </button>
            </div>
            
            <div className="emp-preview-box">
              <div className="emp-preview-avatar">{employee.name.charAt(0)}</div>
              <div className="emp-preview-details">
                <h3>{employee.name}</h3>
                <p><strong>ID:</strong> {employee.id} &nbsp;|&nbsp; <strong>Role:</strong> {employee.role} &nbsp;|&nbsp; <strong>Dep:</strong> {employee.department}</p>
              </div>
            </div>
          </div>

          {/* Project & Dates Info */}
          <div className="cr-card">
            <h2 className="cr-card-title">General Information</h2>
            <div className="cr-input-grid">
              
              <div className="cr-input-group">
                <label>Project ID</label>
                <input type="text" name="projectId" placeholder="PRJ-XXXX-YYY" value={formData.projectId} onChange={handleChange} />
              </div>

              <div className="cr-input-group">
                <label>Day Type</label>
                <select name="dayType" value={formData.dayType} onChange={handleChange}>
                  <option value="Working Day">Working Day</option>
                  <option value="Travel Day">Travel Day</option>
                </select>
              </div>

              <div className="cr-input-group">
                <label>Role in Project</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="General">General Staff</option>
                  <option value="Main Speaker">Main Speaker</option>
                </select>
              </div>

              <div className="cr-input-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
              </div>

              <div className="cr-input-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
              </div>
            </div>

            {formData.role === 'Main Speaker' && (
              <div className="cr-input-grid" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eaeaea' }}>
                <div className="cr-input-group">
                  <label>Start Time (Speaker)</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
                </div>
                <div className="cr-input-group">
                  <label>End Time (Speaker)</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          {/* Complex Allowance Table */}
          <div className="cr-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="cr-card-title" style={{ margin: 0 }}>ตารางการเบิก (Allowance Table)</h2>
            </div>
            
            <div style={{ overflowX: 'auto', padding: '0 24px 24px 24px' }}>
              
              {/* ONSITE TABLE */}
              <div style={{ overflowX: 'auto', border: '1px solid #eaeaea', borderRadius: '8px', marginBottom: '24px' }}>
                <table className="cr-complex-table" style={{ borderBottom: '1px solid #eaeaea' }}>
                  <thead>
                    <tr className="header-primary">
                      <th className="cell-empty" style={{ width: '4%' }}></th>
                      <th colSpan="9">ONSITE ALLOWANCE (WORKING DAYS)</th>
                    </tr>
                    <tr className="header-gray">
                      <th className="cell-empty"></th>
                      <th colSpan="2" style={{ width: '22%' }}>Duration</th>
                      <th colSpan="3" style={{ width: '33%' }}>Add-Ons</th>
                      <th colSpan="2" style={{ width: '22%' }}>Location</th>
                      <th colSpan="2" style={{ width: '19%' }}>Holidays</th>
                    </tr>
                    <tr className="header-light-gray">
                      <th className="cell-index"></th>
                      <th><div className="th-content"><span>1/2 Day</span><span className="price-tag">150</span></div></th>
                      <th><div className="th-content"><span>Full Day</span><span className="price-tag">250</span></div></th>
                      <th><div className="th-content"><span>07:30</span><span className="price-tag">100</span></div></th>
                      <th><div className="th-content"><span>18:30</span><span className="price-tag">100</span></div></th>
                      <th><div className="th-content"><span>21:00</span><span className="price-tag">100</span></div></th>
                      <th><div className="th-content"><span>No Stay</span><span className="price-tag">200</span></div></th>
                      <th><div className="th-content"><span>Stay</span><span className="price-tag">300</span></div></th>
                      <th><div className="th-content"><span>1/2 Day</span><span className="price-tag">600</span></div></th>
                      <th><div className="th-content"><span>Full Day</span><span className="price-tag">1000</span></div></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="cell-index">1</td>
                      <td onClick={() => toggleCheck('onsiteDuration1')}><div className={`cr-checkbox ${tableChecks.onsiteDuration1 ? 'checked' : ''}`}>{tableChecks.onsiteDuration1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteDuration2')}><div className={`cr-checkbox ${tableChecks.onsiteDuration2 ? 'checked' : ''}`}>{tableChecks.onsiteDuration2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteAdd1')}><div className={`cr-checkbox ${tableChecks.onsiteAdd1 ? 'checked' : ''}`}>{tableChecks.onsiteAdd1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteAdd2')}><div className={`cr-checkbox ${tableChecks.onsiteAdd2 ? 'checked' : ''}`}>{tableChecks.onsiteAdd2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteAdd3')}><div className={`cr-checkbox ${tableChecks.onsiteAdd3 ? 'checked' : ''}`}>{tableChecks.onsiteAdd3 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteLoc1')}><div className={`cr-checkbox ${tableChecks.onsiteLoc1 ? 'checked' : ''}`}>{tableChecks.onsiteLoc1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteLoc2')}><div className={`cr-checkbox ${tableChecks.onsiteLoc2 ? 'checked' : ''}`}>{tableChecks.onsiteLoc2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteHol1')}><div className={`cr-checkbox ${tableChecks.onsiteHol1 ? 'checked' : ''}`}>{tableChecks.onsiteHol1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteHol2')}><div className={`cr-checkbox ${tableChecks.onsiteHol2 ? 'checked' : ''}`}>{tableChecks.onsiteHol2 && '✓'}</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* TRAVEL TABLE */}
              <div style={{ overflowX: 'auto', border: '1px solid #eaeaea', borderRadius: '8px', marginBottom: '24px' }}>
                <table className="cr-complex-table">
                  <thead>
                    <tr className="header-primary">
                      <th className="cell-empty" style={{ width: '4%' }}></th>
                      <th colSpan="6">TRAVEL ALLOWANCE (NON-WORKING DAYS)</th>
                      <th colSpan="2" className="cell-empty" style={{ background: 'var(--bg-page)', border: 'none' }}></th>
                    </tr>
                    <tr className="header-gray">
                      <th className="cell-empty"></th>
                      <th colSpan="3" style={{ width: '33%' }}>Outbound</th>
                      <th colSpan="3" style={{ width: '33%' }}>Return</th>
                      <th className="cell-empty" colSpan="2" style={{ width: '30%' }}></th>
                    </tr>
                    <tr className="header-light-gray">
                      <th className="cell-index"></th>
                      <th><div className="th-content"><span>Work</span><span className="price-tag">200</span></div></th>
                      <th><div className="th-content"><span>4hr-</span><span className="price-tag">300</span></div></th>
                      <th><div className="th-content"><span>4hr+</span><span className="price-tag">500</span></div></th>
                      <th><div className="th-content"><span>Work</span><span className="price-tag">100</span></div></th>
                      <th><div className="th-content"><span>4hr-</span><span className="price-tag">200</span></div></th>
                      <th><div className="th-content"><span>4hr+</span><span className="price-tag">400</span></div></th>
                      <th className="cell-total-title">Total</th>
                      <th className="cell-action"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="cell-index">2</td>
                      <td onClick={() => toggleCheck('travelOut1')}><div className={`cr-checkbox ${tableChecks.travelOut1 ? 'checked' : ''}`}>{tableChecks.travelOut1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelOut2')}><div className={`cr-checkbox ${tableChecks.travelOut2 ? 'checked' : ''}`}>{tableChecks.travelOut2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelOut3')}><div className={`cr-checkbox ${tableChecks.travelOut3 ? 'checked' : ''}`}>{tableChecks.travelOut3 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelRet1')}><div className={`cr-checkbox ${tableChecks.travelRet1 ? 'checked' : ''}`}>{tableChecks.travelRet1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelRet2')}><div className={`cr-checkbox ${tableChecks.travelRet2 ? 'checked' : ''}`}>{tableChecks.travelRet2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelRet3')}><div className={`cr-checkbox ${tableChecks.travelRet3 ? 'checked' : ''}`}>{tableChecks.travelRet3 && '✓'}</div></td>
                      <td className="cell-total-value" style={{ color: THEME_COLOR }}>{tableTotal}</td>
                      <td className="cell-action" style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        <Trash2 onClick={clearTableRow} size={18} color="#999" style={{ cursor: 'pointer' }}/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="dashed-add-row"><PlusCircle size={16} style={{marginRight: '8px'}} /> Add Additional Row</div>
            </div>
          </div>

          <div className="cr-card">
            <h2 className="cr-card-title">Personal notes</h2>
            <textarea 
              name="notes"
              className="cr-textarea"
              placeholder="Type any additional context here..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Sidebar Summary */}
        <div className="cr-sidebar-column">
          <div className="cr-summary-card">
            <h2 className="cr-summary-title">Request Summary</h2>
            
            <div className="cr-summary-row">
              <span className="summary-label">Working Days (Mandays)</span>
              <span className="summary-value">{calcResult.mandays} Days</span>
            </div>
            
            <div className="cr-summary-row">
              <span className="summary-label">Travel Days</span>
              <span className="summary-value">{calcResult.travelDays} Days</span>
            </div>

            {formData.role === 'Main Speaker' && (
              <div className="cr-summary-row">
                <span className="summary-label">Speaker Hours</span>
                <span className="summary-value">{calcResult.speakerHours.toFixed(1)} Hrs</span>
              </div>
            )}

            <div className="cr-summary-row" style={{ borderTop: '1px solid #333', paddingTop: '16px', marginTop: '16px' }}>
              <span className="summary-label">Allowance Elements</span>
              <span className="summary-value" style={{ color: THEME_COLOR }}>+ {tableTotal}</span>
            </div>

            {isAlert && (
              <div className="cr-alert-box">
                <span style={{ fontSize: '16px', marginRight: '8px' }}>⚠️</span> 
                <strong>AI Alert:</strong> Exceptional Manday limit detected.
              </div>
            )}

            <div className="cr-summary-total">
              <span>Total Amount</span>
              <span style={{ color: THEME_COLOR }}>฿ {calcResult.grandTotal.toLocaleString()}</span>
            </div>
            
            <div className="cr-actions" style={{ marginTop: '32px' }}>
              <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%' }}>Submit Request</button>
            </div>
          </div>
        </div>

      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>เพิ่มพนักงาน (Select Employee)</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="cr-input-group" style={{ marginBottom: '16px' }}>
                <label>Employee Name</label>
                <input 
                  type="text" 
                  value={modalData.name} 
                  onChange={(e) => setModalData({...modalData, name: e.target.value})} 
                />
              </div>
              <div className="cr-input-group" style={{ marginBottom: '16px' }}>
                <label>Employee ID</label>
                <input 
                  type="text" 
                  value={modalData.id} 
                  onChange={(e) => setModalData({...modalData, id: e.target.value})} 
                />
              </div>
              <div className="cr-input-group" style={{ marginBottom: '16px' }}>
                <label>Role</label>
                <input 
                  type="text" 
                  value={modalData.role} 
                  onChange={(e) => setModalData({...modalData, role: e.target.value})} 
                />
              </div>
              <div className="cr-input-group" style={{ marginBottom: '16px' }}>
                <label>Department</label>
                <input 
                  type="text" 
                  value={modalData.department} 
                  onChange={(e) => setModalData({...modalData, department: e.target.value})} 
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleModalSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .cr-container {
          background-color: transparent;
          font-family: 'Inter', sans-serif;
          color: var(--text-main);
        }

        .cr-header {
          margin-bottom: 32px;
        }

        .cr-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .cr-breadcrumb {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .cr-layout {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }

        .cr-main-column {
          flex: 1 1 600px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .cr-sidebar-column {
          flex: 1 1 300px;
        }

        .cr-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #ED4724;
        }

        .cr-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .cr-card-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          color: var(--text-main);
        }

        .cr-edit-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-card);
          border: 1px solid #ED4724;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #ED4724;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cr-edit-btn:hover {
          background: #ED4724;
          color: white;
        }

        .emp-preview-box {
          display: flex;
          align-items: center;
          gap: 16px;
          background-color: var(--bg-page);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .emp-preview-avatar {
          width: 48px;
          height: 48px;
          background: ${THEME_COLOR};
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
        }

        .emp-preview-details h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 700;
        }

        .emp-preview-details p {
          margin: 0;
          font-size: 13px;
          color: var(--text-muted);
        }

        .cr-input-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .cr-input-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .cr-input-group input, 
        .cr-input-group select {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #ED4724;
          background-color: var(--bg-page);
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
          color: var(--text-main);
          outline: none;
        }

        .cr-input-group input:focus, 
        .cr-input-group select:focus {
          border-color: ${THEME_COLOR};
          background-color: var(--bg-card);
        }

        .cr-textarea {
          width: 100%;
          height: 100px;
          padding: 14px;
          border-radius: 8px;
          border: 1px solid #ED4724;
          background-color: var(--bg-page);
          font-size: 14px;
          resize: vertical;
          box-sizing: border-box;
          color: var(--text-main);
          outline: none;
          font-family: inherit;
        }

        .cr-textarea:focus {
          border-color: ${THEME_COLOR};
          background-color: var(--bg-card);
        }

        .cr-summary-card {
          background-color: var(--text-main);
          color: #ffffff;
          padding: 24px;
          border-radius: 16px;
          position: sticky;
          top: 24px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .cr-summary-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 24px 0;
        }

        .cr-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .summary-label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .summary-value {
          font-weight: 600;
        }

        .cr-alert-box {
          background-color: rgba(237, 71, 36, 0.15);
          color: #FF8A65;
          padding: 12px;
          border-radius: 8px;
          margin-top: 20px;
          font-size: 13px;
          line-height: 1.5;
          border: 1px solid rgba(237, 71, 36, 0.3);
        }

        .cr-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #374151;
          font-size: 18px;
          font-weight: 800;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid #ED4724;
          color: #ED4724;
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-secondary:hover {
          background: #fff5f3;
        }

        .btn-primary {
          background: ${THEME_COLOR};
          border: none;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .btn-primary:hover {
          filter: brightness(1.1);
        }
        
        .btn-primary:active {
          transform: scale(0.98);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--bg-card);
          width: 400px;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .modal-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
        .modal-close:hover {
          background: #F3F4F6;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          border-top: 1px solid #E5E7EB;
          padding-top: 20px;
        }

        /* Complex Table Styles port */
        .cr-complex-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          text-align: center;
          font-family: inherit;
          table-layout: fixed;
        }

        .th-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .price-tag {
          font-weight: 500;
          font-size: 10px;
          color: #666;
        }

        .cr-complex-table th,
        .cr-complex-table td {
          border: 1px solid var(--border-color);
          padding: 10px 4px;
        }

        .cr-complex-table tr.header-primary th {
          background-color: ${THEME_COLOR};
          color: white;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 12px;
          border-color: ${THEME_COLOR};
          border-radius: 0;
        }

        .cr-complex-table tr.header-gray th {
          background-color: #f1f3f4;
          color: var(--text-main);
          font-weight: 700;
          border-bottom: 2px solid #e2e4e6;
        }

        .cr-complex-table tr.header-light-gray th {
          background-color: #fafafa;
          color: #222;
          font-weight: 600;
          line-height: 1.2;
          vertical-align: top;
        }

        .cr-complex-table tbody td {
          background-color: var(--bg-card);
          height: 52px;
          vertical-align: middle;
          cursor: pointer;
          transition: background 0.1s;
        }

        .cr-complex-table tbody td:hover {
          background-color: #fffaf9;
        }

        .cell-empty {
          border-top: none !important;
          border-bottom: none !important;
          background: #fcfcfc !important;
          cursor: default !important;
        }
        
        tr.header-primary th.cell-empty {
          background: ${THEME_COLOR} !important;
        }

        .cell-index {
          font-weight: 700;
          color: var(--text-main);
          background-color: #fafafa !important;
          cursor: default !important;
        }

        .cell-total-title, .cell-total-value {
          font-weight: 800;
          font-size: 14px;
          color: var(--text-main);
          cursor: default !important;
        }

        .cr-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #ddd;
          border-radius: 4px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: transparent;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cr-checkbox.checked {
          background-color: ${THEME_COLOR};
          border-color: ${THEME_COLOR};
          color: #fff;
          transform: scale(1.05);
        }

        .dashed-add-row {
          height: 48px;
          border: 2px dashed #eaeaea;
          border-radius: 8px;
          margin-top: 16px;
          background-color: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .dashed-add-row:hover {
          background-color: #F3F4F6;
          color: var(--text-main);
        }

        /* ===== MOBILE RESPONSIVE ===== */
        @media (max-width: 768px) {
          .cr-layout {
            flex-direction: column;
          }

          .cr-main-column {
            flex: 1 1 100%;
          }

          .cr-sidebar-column {
            flex: 1 1 100%;
          }

          .cr-summary-card {
            position: static;
          }

          .cr-input-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            width: calc(100vw - 32px);
            max-height: 90vh;
            overflow-y: auto;
          }

          .cr-header {
            margin-bottom: 20px;
          }

          .cr-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
