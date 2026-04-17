import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function GoogleForm() {
  const THEME_COLOR = '#ED4724';
  const RATE_W = 1000;
  const RATE_T = 500;
  const SPEAKER_RATE = 600;

  const [formData, setFormData] = useState({
    empId: '',
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
    // Onsite
    onsiteDuration1: false,
    onsiteDuration2: false,
    onsiteAdd1: false,
    onsiteAdd2: false,
    onsiteAdd3: false,
    onsiteLoc1: false,
    onsiteLoc2: false,
    onsiteHol1: false,
    onsiteHol2: false,
    // Travel
    travelOut1: false,
    travelOut2: false,
    travelOut3: false,
    travelRet1: false,
    travelRet2: false,
    travelRet3: false,
  };

  const [tableChecks, setTableChecks] = useState({
    // Prefill some checks to mimic previous appearance
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
        // Uncheck all other fields in the same category
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
    // Calculate table total
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

    // Include the table layout total inside the math
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAlert) {
      alert('WARNING: AI Alert Triggered! This request will be flagged.');
    } else {
      alert('Request Submitted Successfully!');
    }
  };

  return (
    <div className="figma-form-container">
      <div className="figma-header">
        <h1 className="figma-title">form</h1>
        <div className="figma-breadcrumb">Dashboard / Allowance / form</div>
      </div>

      <div className="figma-layout">
        
        {/* Left Content */}
        <div className="figma-main-column">

          {/* Complex Allowance Table Card */}
          <div className="figma-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="figma-card-title" style={{ margin: 0 }}>หัวข้อ</h2>
              <div style={{ width: '80px', height: '28px', background: '#111', borderRadius: '8px' }}></div>
            </div>
            
            <div style={{ overflowX: 'auto', padding: '0 24px 24px 24px' }}>
              
              <div style={{ overflowX: 'auto', border: '1px solid #eaeaea', borderRadius: '8px', marginBottom: '24px' }}>
                <table className="allowance-complex-table" style={{ borderBottom: '1px solid #eaeaea' }}>
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
                      <td onClick={() => toggleCheck('onsiteDuration1')}><div className={`custom-checkbox ${tableChecks.onsiteDuration1 ? 'checked' : ''}`}>{tableChecks.onsiteDuration1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteDuration2')}><div className={`custom-checkbox ${tableChecks.onsiteDuration2 ? 'checked' : ''}`}>{tableChecks.onsiteDuration2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteAdd1')}><div className={`custom-checkbox ${tableChecks.onsiteAdd1 ? 'checked' : ''}`}>{tableChecks.onsiteAdd1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteAdd2')}><div className={`custom-checkbox ${tableChecks.onsiteAdd2 ? 'checked' : ''}`}>{tableChecks.onsiteAdd2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteAdd3')}><div className={`custom-checkbox ${tableChecks.onsiteAdd3 ? 'checked' : ''}`}>{tableChecks.onsiteAdd3 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteLoc1')}><div className={`custom-checkbox ${tableChecks.onsiteLoc1 ? 'checked' : ''}`}>{tableChecks.onsiteLoc1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteLoc2')}><div className={`custom-checkbox ${tableChecks.onsiteLoc2 ? 'checked' : ''}`}>{tableChecks.onsiteLoc2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteHol1')}><div className={`custom-checkbox ${tableChecks.onsiteHol1 ? 'checked' : ''}`}>{tableChecks.onsiteHol1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('onsiteHol2')}><div className={`custom-checkbox ${tableChecks.onsiteHol2 ? 'checked' : ''}`}>{tableChecks.onsiteHol2 && '✓'}</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* TRAVEL TABLE */}
              <div style={{ overflowX: 'auto', border: '1px solid #eaeaea', borderRadius: '8px', marginBottom: '24px' }}>
                <table className="allowance-complex-table">
                  <thead>
                    <tr className="header-primary">
                      <th className="cell-empty" style={{ width: '4%' }}></th>
                      <th colSpan="6">TRAVEL ALLOWANCE (NON-WORKING DAYS)</th>
                      <th colSpan="2" className="cell-empty" style={{ background: '#fcfcfc', border: 'none' }}></th>
                    </tr>
                    <tr className="header-gray">
                      <th className="cell-empty"></th>
                      <th colSpan="3" style={{ width: '33%' }}>Outbound (15/01/25)</th>
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
                      <td onClick={() => toggleCheck('travelOut1')}><div className={`custom-checkbox ${tableChecks.travelOut1 ? 'checked' : ''}`}>{tableChecks.travelOut1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelOut2')}><div className={`custom-checkbox ${tableChecks.travelOut2 ? 'checked' : ''}`}>{tableChecks.travelOut2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelOut3')}><div className={`custom-checkbox ${tableChecks.travelOut3 ? 'checked' : ''}`}>{tableChecks.travelOut3 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelRet1')}><div className={`custom-checkbox ${tableChecks.travelRet1 ? 'checked' : ''}`}>{tableChecks.travelRet1 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelRet2')}><div className={`custom-checkbox ${tableChecks.travelRet2 ? 'checked' : ''}`}>{tableChecks.travelRet2 && '✓'}</div></td>
                      <td onClick={() => toggleCheck('travelRet3')}><div className={`custom-checkbox ${tableChecks.travelRet3 ? 'checked' : ''}`}>{tableChecks.travelRet3 && '✓'}</div></td>
                      <td className="cell-total-value" style={{ color: THEME_COLOR }}>{tableTotal}</td>
                      <td className="cell-action" style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        <Trash2 onClick={clearTableRow} size={18} color="#999" style={{ cursor: 'pointer' }}/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="dashed-empty-row">+ Add Row</div>
            </div>
          </div>
          
          <div className="figma-card">
            <h2 className="figma-card-title">General Information</h2>
            <div className="figma-input-grid">
              
              <div className="figma-input-group">
                <label>Employee ID</label>
                <input type="text" name="empId" placeholder="ID (e.g. 2024/001)" value={formData.empId} onChange={handleChange} />
              </div>

              <div className="figma-input-group">
                <label>Project ID</label>
                <input type="text" name="projectId" placeholder="Project ID" value={formData.projectId} onChange={handleChange} />
              </div>

              <div className="figma-input-group">
                <label>Day Type</label>
                <select name="dayType" value={formData.dayType} onChange={handleChange}>
                  <option value="Working Day">Working Day</option>
                  <option value="Travel Day">Travel Day</option>
                </select>
              </div>

              <div className="figma-input-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="General">General Staff</option>
                  <option value="Main Speaker">Main Speaker</option>
                </select>
              </div>

              <div className="figma-input-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
              </div>

              <div className="figma-input-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
              </div>
            </div>

            {formData.role === 'Main Speaker' && (
              <div className="figma-input-grid" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #eaeaea' }}>
                <div className="figma-input-group">
                  <label>Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
                </div>
                <div className="figma-input-group">
                  <label>End Time</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

          <div className="figma-card">
            <h2 className="figma-card-title">Personal notes</h2>
            <textarea 
              name="notes"
              className="figma-textarea"
              placeholder="Type any additional context here..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Right Content (Sidebar Summary) */}
        <div className="figma-sidebar-column">
          <div className="figma-summary-card">
            <h2 className="figma-summary-title">Request Summary</h2>
            
            <div className="figma-summary-row">
              <span className="summary-label">Working Days (Mandays)</span>
              <span className="summary-value">{calcResult.mandays} Days</span>
            </div>
            
            <div className="figma-summary-row">
              <span className="summary-label">Travel Days</span>
              <span className="summary-value">{calcResult.travelDays} Days</span>
            </div>

            {formData.role === 'Main Speaker' && (
              <div className="figma-summary-row">
                <span className="summary-label">Speaker Hours</span>
                <span className="summary-value">{calcResult.speakerHours.toFixed(1)} Hrs</span>
              </div>
            )}

            <div className="figma-summary-row" style={{ borderTop: '1px solid #333', paddingTop: '16px', marginTop: '16px' }}>
              <span className="summary-label">Allowance Elements</span>
              <span className="summary-value" style={{ color: THEME_COLOR }}>+ {tableTotal}</span>
            </div>

            {isAlert && (
              <div className="figma-alert-box">
                <span style={{ fontSize: '16px', marginRight: '8px' }}>⚠️</span> 
                <strong>AI Alert:</strong> Exceptional Manday limit detected.
              </div>
            )}

            <div className="figma-summary-total">
              <span>Total Amount</span>
              <span style={{ color: THEME_COLOR }}>฿ {calcResult.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="figma-actions">
        <button className="btn-secondary">Save Draft</button>
        <button className="btn-primary" onClick={handleSubmit}>Submit Request</button>
      </div>

      <style>{`
        .figma-form-container {
          background-color: #fafafa;
          min-height: 100vh;
          padding: 40px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #111;
        }

        .figma-header {
          margin-bottom: 32px;
        }

        .figma-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 8px 0;
          letter-spacing: -1px;
        }

        .figma-breadcrumb {
          font-size: 13px;
          color: #888;
          font-weight: 500;
        }

        .figma-layout {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
        }

        .figma-main-column {
          flex: 1 1 600px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .figma-sidebar-column {
          flex: 1 1 300px;
        }

        .figma-card {
          background: var(--bg-card);
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          border: 1px solid #eaeaea;
        }

        .figma-card-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 24px 0;
        }

        .figma-input-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .figma-input-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #444;
          margin-bottom: 8px;
        }

        .figma-input-group input, 
        .figma-input-group select {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background-color: #fcfcfc;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
          color: #111;
          outline: none;
        }

        .figma-input-group input:focus, 
        .figma-input-group select:focus {
          border-color: #111;
        }

        .figma-textarea {
          width: 100%;
          height: 120px;
          padding: 16px;
          border-radius: 8px;
          border: none;
          background-color: #f4f4f4;
          font-size: 14px;
          resize: vertical;
          box-sizing: border-box;
          color: #111;
          outline: none;
          font-family: inherit;
        }

        .figma-textarea:focus {
          background-color: #ededed;
        }

        .figma-summary-card {
          background-color: #111111;
          color: #ffffff;
          padding: 32px;
          border-radius: 16px;
          position: sticky;
          top: 24px;
        }

        .figma-summary-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 32px 0;
        }

        .figma-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .summary-label {
          color: #999;
          font-weight: 500;
        }

        .summary-value {
          font-weight: 600;
        }

        .figma-alert-box {
          background-color: rgba(237, 71, 36, 0.15);
          color: #ff6b6b;
          padding: 12px 16px;
          border-radius: 8px;
          margin-top: 24px;
          font-size: 13px;
          line-height: 1.5;
          border: 1px solid rgba(237, 71, 36, 0.3);
        }

        .figma-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #333;
          font-size: 20px;
          font-weight: 800;
        }

        .figma-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 40px;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid #ddd;
          color: #111;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-secondary:hover {
          background: #f4f4f4;
        }

        .btn-primary {
          background: #111;
          border: none;
          color: #fff;
          padding: 14px 40px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .btn-primary:hover {
          background: #000;
        }
        
        .btn-primary:active {
          transform: scale(0.98);
        }

        /* Complex Table Styles */
        .allowance-complex-table {
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

        .allowance-complex-table th,
        .allowance-complex-table td {
          border: 1px solid #eaeaea;
          padding: 10px 4px;
        }

        .allowance-complex-table tr.header-primary th {
          background-color: ${THEME_COLOR};
          color: white;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 12px;
          border-color: ${THEME_COLOR};
          border-radius: 0;
        }

        .allowance-complex-table tr.header-gray th {
          background-color: #f1f3f4;
          color: #111;
          font-weight: 700;
          border-bottom: 2px solid #e2e4e6;
        }

        .allowance-complex-table tr.header-light-gray th {
          background-color: #fafafa;
          color: #222;
          font-weight: 600;
          line-height: 1.2;
          vertical-align: top;
        }

        .allowance-complex-table tbody td {
          background-color: var(--bg-card);
          height: 52px;
          vertical-align: middle;
          cursor: pointer;
          transition: background 0.1s;
        }

        .allowance-complex-table tbody td:hover {
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
          color: #111;
          background-color: #fafafa !important;
          cursor: default !important;
        }

        .cell-total-title, .cell-total-value {
          font-weight: 800;
          font-size: 14px;
          color: #111;
          cursor: default !important;
        }

        .custom-checkbox {
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

        .custom-checkbox.checked {
          background-color: ${THEME_COLOR};
          border-color: ${THEME_COLOR};
          color: #fff;
          transform: scale(1.05);
        }

        .dashed-empty-row {
          height: 60px;
          border: 2px dashed #eaeaea;
          border-radius: 8px;
          margin-top: 16px;
          background-color: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .dashed-empty-row:hover {
          background-color: #f0f0f0;
          color: #111;
        }

      `}</style>
    </div>
  );
}
