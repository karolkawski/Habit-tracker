import { enableStyle, sDayWrapperStyle, sDaysBoxStyle } from './styleOptions';

interface FrequencyProps {
  size: string;
  days: {
    Mon: boolean;
    Tue: boolean;
    Wed: boolean;
    Thu: boolean;
    Fri: boolean;
    Sat: boolean;
    Sun: boolean;
  };
  repeat: string;
}

export const Frequency = ({ size = '', days, repeat }: FrequencyProps) => {
  const isSmall = size === 's';
  if (!days || !repeat) {
    return <>brak danych</>;
  }

  return (
    <div className={`flex h-8 flex-row items-center justify-center`}>
      <div className="flex h-8">
        {Object.entries(days).map(([dayName, dayValue]) => (
          <div
            className={`flex ${sDayWrapperStyle[isSmall]} flex-col items-center`}
            key={dayName}
          >
            <div className={`flex-1 text-center text-xs w-3`}>
              {dayName.substring(0, 1)}
            </div>
            <div
              className={`${sDaysBoxStyle[isSmall]} rounded ${enableStyle[dayValue]}`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};
