import { Frequency } from '../components/UI/Frequency/Frequency';
import { Icon } from '../components/UI/Icon/Icon';
import { ColorBox } from '../components/UI/ColorBox/ColorBox';
import { Back } from '../components/UI/Back/Back';
import { Button } from 'flowbite-react';

export const Habit = () => {
  const habit = undefined;
  return (
    <>
      {!habit ? (
        <>NO EXIST</>
      ) : (
        <>
          <h2>Habit NO:{habit._id}</h2>
          <h2>Habit name: {habit.name}</h2>
          <div className="Habit__details">
            <h3>Details</h3>
            <div>type: {habit.type}</div>
            <div>
              color: <ColorBox color={habit.color} />
            </div>
            <div>
              icon: <Icon icon={habit.icon} />
            </div>
            <div>frequency: {habit.frequency.repeat}</div>
          </div>
          <div className="Habit__stats">
            <Frequency size={''} {...habit.frequency} />
          </div>
          <div className="Habit__actions">
            <Button color="danger">Delete</Button>
            <Back />
          </div>
        </>
      )}
    </>
  );
};
