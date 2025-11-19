// src/components/DealCard.jsx

function DealCard({ title, highlight, badge, buttonText, image }) {
  return (
    <article className="deal-card">
      <div className="deal-bg">
        <img src={image} alt={title} />
      </div>
      <div className="deal-overlay" />
      <div className="deal-content">
        <div className="deal-badge">{badge}</div>

        <div>
          <h3 className="deal-title">{title}</h3>
          {highlight && <div className="deal-highlight">{highlight}</div>}
        </div>

        <button className="deal-button">{buttonText}</button>
      </div>
    </article>
  );
}

export default DealCard;
