import { cn } from '@/lib/utils';
import type { RideSeat } from '@/types';

interface SeatGridProps {
  seats: RideSeat[];
  selected: RideSeat[];
  onToggle: (seat: RideSeat) => void;
  driverRow?: number | null;
  driverCol?: number | null;
}

// Mirrors customer_mobile_app's SeatPickerModal: a grid built from each
// seat's own row/col (not assumed to be a fixed bus layout), with an aisle
// gap after the second column and the driver's seat left blank wherever the
// admin actually placed it — same data, same layout logic, re-implemented
// for the web instead of React Native.
export function SeatGrid({ seats, selected, onToggle, driverRow, driverCol }: SeatGridProps) {
  const maxRow = seats.length ? Math.max(...seats.map((s) => s.row)) : 0;
  const maxCol = seats.length ? Math.max(...seats.map((s) => s.col)) : 0;
  const grid: (RideSeat | null)[][] = Array.from({ length: maxRow }, (_, r) =>
    Array.from({ length: maxCol }, (_, c) => seats.find((s) => s.row === r + 1 && s.col === c + 1) ?? null),
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-5 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded border-2 border-secondary-500 bg-white dark:bg-gray-800" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded bg-gray-300 dark:bg-gray-600" />
          Taken
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded bg-secondary-500" />
          Selected
        </span>
      </div>

      <div className="overflow-x-auto max-w-full">
        <div className="inline-flex flex-col gap-2 p-1">
          {grid.map((row, ri) => (
            <div key={ri} className="flex gap-2">
              {row.map((seat, ci) => {
                const aisle = ci === 1 ? 'ml-4' : '';
                if (!seat) {
                  if (driverRow === ri + 1 && driverCol === ci + 1) {
                    return (
                      <div
                        key={ci}
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400',
                          aisle,
                        )}
                        title="Driver"
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M12 2a5 5 0 0 1 5 5 5 5 0 0 1-3 4.58V15h3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-3v2a1 1 0 0 1-2 0v-2H9v2a1 1 0 0 1-2 0v-2H4a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h3v-3.42A5 5 0 0 1 7 7a5 5 0 0 1 5-5Z" />
                        </svg>
                      </div>
                    );
                  }
                  return <div key={ci} className={cn('h-10 w-10', aisle)} />;
                }
                const isBooked = seat.status === 'booked';
                const isSelected = selected.some((s) => s.id === seat.id);
                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={isBooked}
                    onClick={() => onToggle(seat)}
                    className={cn(
                      'h-10 w-10 rounded-lg border-2 text-xs font-semibold transition-colors',
                      aisle,
                      isBooked &&
                        'cursor-not-allowed border-gray-300 bg-gray-300 text-gray-500 dark:border-gray-600 dark:bg-gray-600',
                      !isBooked &&
                        !isSelected &&
                        'border-secondary-500 bg-white text-gray-700 hover:bg-secondary-50 dark:bg-gray-800 dark:text-gray-200',
                      isSelected && 'border-secondary-500 bg-secondary-500 text-white',
                    )}
                  >
                    {seat.seat_number}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
