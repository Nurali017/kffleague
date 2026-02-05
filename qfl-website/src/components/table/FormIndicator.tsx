'use client';

interface FormIndicatorProps {
  form?: string;
}

export function FormIndicator({ form }: FormIndicatorProps) {
  if (!form) return <span className="text-gray-300 dark:text-slate-600">—</span>;

  return (
    <div className="flex gap-0.5">
      {form.split('').map((result, i) => {
        const isWin = result === 'W';
        const isDraw = result === 'D';
        const isLoss = result === 'L';

        return (
          <span
            key={i}
            className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center transition-transform hover:scale-110 ${
              isWin ? 'bg-green-500 text-white' : ''
            }${isDraw ? 'bg-gray-300 dark:bg-dark-surface-soft text-gray-600 dark:text-slate-200' : ''}${
              isLoss ? 'bg-red-500 text-white' : ''
            }`}
            title={isWin ? 'Жеңіс' : isDraw ? 'Тең' : 'Жеңіліс'}
          >
            {isWin ? 'Ж' : isDraw ? 'Т' : 'Ж'}
          </span>
        );
      })}
    </div>
  );
}
