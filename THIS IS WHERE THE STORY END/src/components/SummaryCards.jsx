import './SummaryCards.css';

function SummaryCards() {
  const cards = [
    { id: 1, title: 'Total Employees', value: '452', trend: '+12%' },
    { id: 2, title: 'Pending Requests', value: '42', trend: '+5%' },
    { id: 3, title: 'Approved Allowances', value: '386', trend: '+18%' },
    { id: 4, title: 'Rejected Allowances', value: '24', trend: '-2%' },
  ];

  return (
    <div className="summary-cards">
      {cards.map(card => (
        <div key={card.id} className="summary-card">
          <p className="card-title">{card.title}</p>
          <div className="card-data">
            <h3 className="card-value">{card.value}</h3>
            <span className={`card-trend ${card.trend.startsWith('+') ? 'positive' : 'negative'}`}>
              {card.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
