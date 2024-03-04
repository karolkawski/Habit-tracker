// import './frequency.scss';
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
  if (!days || !repeat) {
    return <>brak danych</>;
  }

  return (
    <div className={`Frequency ${size === 's' ? 'Frequency--s' : ''}`}>
      <div className="Frequency__repeat">{repeat}</div>
      <div className="Frequency__days">
        {Object.entries(days).map(([dayName, dayValue]) => (
          <div className="Frequency__day" key={dayName}>
            <div className={'Frequency__week'}>{dayName.substring(0, 1)}</div>
            <div
              className={'days-box days-box--' + (dayValue ? 'true' : 'false')}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};
