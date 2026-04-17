import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const THEME_COLOR = '#ED4724';

const initialTableState = {
  onsiteDuration1: false, onsiteDuration2: false, onsiteAdd1: false, onsiteAdd2: false, onsiteAdd3: false, onsiteLoc1: false, onsiteLoc2: false, onsiteHol1: false, onsiteHol2: false,
  travelOut1: false, travelOut2: false, travelOut3: false, travelRet1: false, travelRet2: false, travelRet3: false,
};

export default function EmployeeEditModal({ employee, onClose, onSave }) {
  const [localEmp, setLocalEmp] = useState({
    id: employee.id || '',
    name: employee.name || 'พนักงาน บราๆ',
    role: employee.role || '',
    note: employee.note || ''
  });

  const [tableChecks, setTableChecks] = useState(employee.tableChecks || { ...initialTableState, onsiteDuration1: true });
  const [tableTotal, setTableTotal] = useState(0);

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
    setTableChecks({ ...initialTableState });
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

  const handleSave = () => {
    onSave({
      ...employee,
      ...localEmp,
      tableChecks,
      totalAmount: tableTotal
    });
  };

  return (
    <div className="cr-modal-overlay">
      <div className="cr-modal-box">
        <h2 className="cr-modal-title">{localEmp.name}</h2>
        
        <div className="cr-modal-grid-3">
          <div className="input-group">
            <label>รหัสพนักงาน</label>
            <input 
              type="text" 
              value={localEmp.id} 
              onChange={e => setLocalEmp({...localEmp, id: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label>ชื่อ-นามสกุล</label>
            <input 
              type="text" 
              value={localEmp.name === 'พนักงาน บราๆ' ? '' : localEmp.name} 
              placeholder="พนักงาน บราๆ"
              onChange={e => setLocalEmp({...localEmp, name: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label>ตำแหน่ง</label>
            <input 
              type="text" 
              value={localEmp.role} 
              onChange={e => setLocalEmp({...localEmp, role: e.target.value})} 
            />
          </div>
        </div>

        {/* ONSITE TABLE */}
        <div className="cr-modal-table-container">
          <table className="cr-complex-table">
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
        <div className="cr-modal-table-container">
          <table className="cr-complex-table">
            <thead>
              <tr className="header-primary">
                <th className="cell-empty" style={{ width: '4%' }}></th>
                <th colSpan="6">TRAVEL ALLOWANCE (NON-WORKING DAYS)</th>
                <th colSpan="2" className="cell-empty" style={{ background: 'var(--bg-card)', border: 'none' }}></th>
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

        {/* NOTE & AMOUNT BLOCKS */}
        <div className="cr-modal-bottom-grid">
          <div className="grey-block flex-center">
            หมายเหตุ: <input className="inline-transparent-input" value={localEmp.note} onChange={e=>setLocalEmp({...localEmp, note: e.target.value})} placeholder="พิมพ์ข้อความ..." />
          </div>
          <div className="grey-block flex-center">
            เงิน: {tableTotal.toLocaleString()} ฿
          </div>
        </div>

        {/* BUTTONS */}
        <div className="cr-modal-actions">
          <button className="cr-modal-btn cr-modal-cancel" onClick={onClose}>ยกเลิก</button>
          <button className="cr-modal-btn cr-modal-ok" onClick={handleSave}>ตกลง</button>
        </div>

      </div>

      <style>{`
        .cr-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .cr-modal-box {
          background: var(--bg-card);
          border-radius: 12px;
          padding: 32px;
          width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        .cr-modal-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 24px 0;
          color: #000;
        }

        .cr-modal-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .cr-modal-table-container {
          overflow-x: auto;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .cr-modal-bottom-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          margin-top: 24px;
        }

        .grey-block {
          background: #D9D9D9; 
          border-radius: 0px; 
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          color: #000;
        }

        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .inline-transparent-input {
          background: transparent;
          border: none;
          outline: none;
          margin-left: 8px;
          font-size: 14px;
          color: #000;
          width: 100%;
        }

        .cr-modal-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
        }

        .cr-modal-btn {
          padding: 12px 40px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          min-width: 120px;
        }

        .cr-modal-cancel {
          background: #D9D9D9;
          color: #000;
        }

        .cr-modal-ok {
          background: #ED4724; 
          color: #fff;
        }
        
        .cr-modal-ok:hover {
          filter: brightness(1.1);
        }

        /* Complex Table Styles port for Modal */
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
          border: 1px solid #eaeaea;
          padding: 10px 4px;
        }

        .cr-complex-table tr.header-primary th {
          background-color: ${THEME_COLOR};
          color: white;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 8px;
          border-color: ${THEME_COLOR};
          border-radius: 0;
        }

        .cr-complex-table tr.header-gray th {
          background-color: #f1f3f4;
          color: #111;
          font-weight: 700;
          border-bottom: 2px solid #e2e4e6;
        }

        .cr-complex-table tr.header-light-gray th {
          background-color: #fafafa;
          color: #222;
          font-weight: 600;
          line-height: 1.2;
        }

        .cr-complex-table tbody td {
          background-color: var(--bg-card);
          height: 48px;
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
          background: #ffffff !important;
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
          font-size: 13px;
          color: #111;
          cursor: default !important;
        }

        .cr-checkbox {
          width: 16px;
          height: 16px;
          border: 2px solid #ddd;
          border-radius: 4px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: transparent;
          font-size: 12px;
          font-weight: bold;
        }

        .cr-checkbox.checked {
          background-color: ${THEME_COLOR};
          border-color: ${THEME_COLOR};
          color: #fff;
        }
      `}</style>
    </div>
  );
}
