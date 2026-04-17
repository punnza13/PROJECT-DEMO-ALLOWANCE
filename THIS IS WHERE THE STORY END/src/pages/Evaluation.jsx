import React, { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';

export default function Evaluation() {
  const { submitEvaluation } = useWorkflow();
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState('');
  const [score, setScore] = useState('5');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitEvaluation({ projectId, date, score: parseInt(score), feedback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center', backgroundColor: 'var(--bg-page)' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
            ✓
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Thank You!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Your evaluation for project <strong>{projectId}</strong> has been submitted successfully.</p>
          <button onClick={() => setSubmitted(false)} style={{ marginTop: '24px', color: 'var(--accent-color)', textDecoration: 'underline' }}>Submit another</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', backgroundColor: 'var(--bg-page)' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)', textAlign: 'center', marginBottom: '8px' }}>Project Evaluation (UC03)</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>Instant Evaluation System via QR / Link</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Project ID</label>
            <input 
              type="text" 
              required 
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="e.g., PRJ-26-001"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Date of Execution</label>
            <input 
              type="date" 
              required 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Rating (1-5)</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[1, 2, 3, 4, 5].map(num => (
                <label key={num} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input type="radio" name="score" value={num} checked={score === String(num)} onChange={(e) => setScore(e.target.value)} />
                  <span>{num}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Feedback</label>
            <textarea 
              rows="4" 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Any additional comments..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <button type="submit" style={{ padding: '14px', backgroundColor: 'var(--accent-color)', color: 'white', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', marginTop: '8px' }}>
            Submit Evaluation
          </button>
        </form>
      </div>
    </div>
  );
}
