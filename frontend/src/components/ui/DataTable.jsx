import { Inbox } from "lucide-react";

export function DataTable({ title, rows, columns }) {
  const normalizedRows = rows.map((row, index) => {
    if (!Array.isArray(row)) return { ...row, id: row.id ?? `${title}-${index}` };
    const readableKey = row
      .filter((cell) => ["string", "number"].includes(typeof cell))
      .slice(0, 3)
      .join("-");
    return { id: `${readableKey || title}-${index}`, cells: row };
  });

  return (
    <article className="data-panel">
      <div className="data-panel-heading"><div><h3>{title}</h3><span>{normalizedRows.length} kayıt</span></div></div>
      <div className="table-wrap">
        <table aria-label={title}>
          {columns ? (
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={`${column}-${index}`}>{column}</th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {normalizedRows.length === 0 ? (
              <tr>
                <td className="table-empty" colSpan={columns?.length ?? 1}><Inbox size={22} /><span>Henüz kayıt bulunmuyor.</span></td>
              </tr>
            ) : normalizedRows.map((row) => (
              <tr key={row.id}>
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${index}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
