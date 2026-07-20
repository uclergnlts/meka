export function DataTable({ title, rows, columns }) {
  const normalizedRows = rows.map((row, index) => Array.isArray(row) ? { id: row.join("-") || index, cells: row } : row);

  return (
    <article className="data-panel">
      <h3>{title}</h3>
      <div className="table-wrap">
        <table>
          {columns ? (
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {normalizedRows.length === 0 ? (
              <tr>
                <td colSpan={columns?.length ?? 1}>Kayıt bulunamadı.</td>
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
