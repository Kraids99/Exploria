
function DestinationCard({ name, image, badge }) {
  return (
    <article className="destination-card">
      <div className="destination-thumb">
        <img src={image} alt={name} />
        <div className="destination-badge">{badge}</div>
      </div>

      <div className="destination-body">
        <div className="destination-name">{name} {'>'}</div>
      </div>
    </article>
  );
}

export default DestinationCard;
