export default function Card({ title, value, icon, color }) {
  return (
    <div className="metric-card">
      <span className="icon">{icon}</span>
      <div className="label">{title}</div>
      <div className="value" style={color ? { color } : {}}>{value ?? "—"}</div>
    </div>
  );
}
