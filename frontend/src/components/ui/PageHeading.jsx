import { CalendarDays } from "lucide-react";

export function PageHeading({ title, description, chip = "Temmuz 2026" }) {
  return (
    <div className="admin-heading">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <span className="date-chip">
        <CalendarDays size={16} /> {chip}
      </span>
    </div>
  );
}
