import { setupCategories, type BlogSetup } from "@/lib/blog";
import "./progression-filter.css";

export default function ProgressionFilter({ setup, selected, onSelect }: {
  setup: BlogSetup;
  selected: string | null;
  onSelect: (category: string | null) => void;
}) {
  return (
    <div className="progression-filter" aria-label={`${setup.title} progression categories`} role="group">
      <button type="button" aria-pressed={selected === null} onClick={() => onSelect(null)}>All updates</button>
      {setupCategories(setup).map((category) => (
        <button type="button" key={category} aria-pressed={selected === category} onClick={() => onSelect(category)}>{category}</button>
      ))}
    </div>
  );
}
