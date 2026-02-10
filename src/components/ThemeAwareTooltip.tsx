import { TooltipProps } from 'recharts';

export function ThemeAwareTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="text-foreground font-medium mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="text-foreground font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
