interface ResultsTableProps {
  results: any[];
}

export default function ResultsTable({ results }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">אין תוצאות זמינות עבור אירוע זה</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">מחלקה</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">רוכב</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">סוס</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">ציון סופי (%)</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">זכאות</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={result.id} className="border-b border-border hover:bg-muted/50" data-testid={`row-result-${index}`}>
              <td className="py-3 px-4" data-testid={`text-class-${index}`}>
                {result.classes?.name || 'לא זמין'}
              </td>
              <td className="py-3 px-4 font-medium" data-testid={`text-rider-${index}`}>
                {result.pairs?.riders?.name || 'לא זמין'}
              </td>
              <td className="py-3 px-4" data-testid={`text-horse-${index}`}>
                {result.pairs?.horses?.name || 'לא זמין'}
              </td>
              <td className="py-3 px-4">
                <span className="font-semibold text-primary" data-testid={`text-score-${index}`}>
                  {Number(result.final_score_pct).toFixed(1)}%
                </span>
              </td>
              <td className="py-3 px-4">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    result.eligible 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                  data-testid={`text-eligible-${index}`}
                >
                  {result.eligible ? 'זכאי' : 'לא זכאי'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
