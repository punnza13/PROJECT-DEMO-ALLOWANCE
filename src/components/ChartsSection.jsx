import './ChartsSection.css';

function ChartsSection() {
  // Mock data for the chart
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
  const chartHeight = 200;
  
  const announcements = [
    { id: 1, title: 'Company Update', desc: 'New policies for Q3 allowance are now available.', time: '2 hours ago • HR Admin' },
    { id: 2, title: 'System Maintenance', desc: 'Downtime scheduled for this weekend.', time: '5 hours ago • IT Setup' },
    { id: 3, title: 'Welcome New Hires', desc: 'Please welcome our new engineering staff.', time: '1 day ago • HR Admin' },
  ];

  return (
    <div className="charts-section">
      <div className="chart-card">
        <div className="chart-header">
          <h3>Monthly Allowance Trends</h3>
          <div className="chart-legend">
            <span className="legend-item"><span className="dot dot-operations"></span> Operations</span>
            <span className="legend-item"><span className="dot dot-engineering"></span> Engineering</span>
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-bars">
            {months.map((month, idx) => {
              const hOperation = Math.floor(Math.random() * 80) + 40;
              const hEngineering = Math.floor(Math.random() * 60) + 30;
              return (
                <div key={month} className="bar-group">
                  <div className="bars">
                    <div className="bar bar-operations" style={{ height: `${hOperation}px` }}>
                       {idx === 4 && <div className="chart-tooltip">$28k</div>}
                    </div>
                    <div className="bar bar-engineering" style={{ height: `${hEngineering}px` }}></div>
                  </div>
                  <span className="month-label">{month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="announcements-card">
        <div className="announcements-header">
          <h3>Announcements</h3>
          <a href="#" className="view-all">View All</a>
        </div>
        <div className="announcements-list">
          {announcements.map(item => (
            <div key={item.id} className="announcement-item">
              <h4 className="ann-title">{item.title}</h4>
              <p className="ann-desc">{item.desc}</p>
              <span className="ann-time">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChartsSection;
