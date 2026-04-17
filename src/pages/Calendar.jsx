import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const { requests } = useWorkflow();
  
  // Starting with April 2026 since mock data is there
  const [currentDate, setCurrentDate] = useState(new Date("2026-04-01T00:00:00"));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const daysOfWeek = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

  const getProjectsForDay = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return requests.filter(req => {
      if (!req.startDate || !req.endDate) return false;
      return dateStr >= req.startDate && dateStr <= req.endDate;
    });
  };

  const getColorsForIndex = (index) => {
    const colors = [
      { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
      { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
      { bg: '#fef08a', text: '#854d0e', border: '#fde047' },
      { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', 'Prompt', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text-main)' }}>ปฏิทินปฏิบัติงาน</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>แสดงช่วงเวลาของโปรเจกต์ที่มีการเบิก</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-card)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={24} color="var(--text-main)" />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)', minWidth: '160px', textAlign: 'center' }}>
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ChevronRight size={24} color="var(--text-main)" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        
        {/* Days Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: 'var(--bg-page)', borderBottom: '1px solid var(--border-color)' }}>
          {daysOfWeek.map(day => (
            <div key={day} style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '14px' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', autoRows: 'minmax(120px, auto)' }}>
          
          {/* Empty cells before the first day */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} style={{ borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}></div>
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const projectsToday = getProjectsForDay(day);
            const isToday = 
              day === new Date().getDate() && 
              month === new Date().getMonth() && 
              year === new Date().getFullYear();

            return (
              <div key={`day-${day}`} style={{ borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ 
                  alignSelf: 'flex-start', 
                  fontSize: '14px', 
                  fontWeight: isToday ? 'bold' : '500', 
                  color: isToday ? '#fff' : 'var(--text-main)',
                  backgroundColor: isToday ? '#ef4444' : 'transparent',
                  padding: isToday ? '2px 8px' : '2px 8px',
                  borderRadius: isToday ? '9999px' : '0'
                }}>
                  {day}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {projectsToday.map((proj, pIdx) => {
                    const colors = getColorsForIndex(pIdx);
                    return (
                      <div 
                        key={`${day}-${proj.id}`}
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={`${proj.projectId} - ${proj.requestorName}`}
                      >
                        {proj.projectId}
                      </div>
                    )
                  })}
                </div>
              </div>
            );
          })}

          {/* Fill remaining empty cells to make it a neat grid if needed */}
          {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, idx) => (
            <div key={`empty-end-${idx}`} style={{ borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-page)' }}></div>
          ))}
          
        </div>
      </div>
    </div>
  );
}
