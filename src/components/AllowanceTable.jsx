import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';
import './AllowanceTable.css';

function AllowanceTable() {
  const { requests } = useWorkflow();
  const navigate = useNavigate();

  const handleExportCSV = () => {
    // Basic CSV Export (UC06)
    const headers = ["ID", "Project", "Requestor", "StartDate", "EndDate", "Total Manday", "Total Amount", "Status"];
    const rows = requests.map(r => [
      r.id, r.projectId, r.requestorName, r.startDate, r.endDate, r.totalManday, r.totalAmount, r.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "allowance_export.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="allowance-table-container">
      <div className="table-header-bar">
        <h3>Recent Allowance Requests</h3>
        <div className="table-actions">
          <button className="table-btn" onClick={handleExportCSV}>Export CSV</button>
        </div>
      </div>
      
      <table className="allowances-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Project</th>
            <th>Employee</th>
            <th>Mandays</th>
            <th>Amount (THB)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} onClick={() => navigate(`/project/${req.projectId}`)} style={{ cursor: 'pointer' }} className="clickable-row">
              <td style={{ fontWeight: '500' }}>{req.id}</td>
              <td>{req.projectId}</td>
              <td>
                <div className="employee-info">
                  <div className="emp-avatar"></div>
                  <div>
                    <p className="emp-name">{req.requestorName}</p>
                    <p className="emp-role">{req.requestorId}</p>
                  </div>
                </div>
              </td>
              <td className="amount-cell">{req.totalManday} Days</td>
              <td className="amount-cell">{req.totalAmount.toLocaleString()}</td>
              <td>
                <span className={`status-pill status-${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AllowanceTable;
