import { Frequency } from '../components/UI/Frequency/Frequency';
import { Icon } from '../components/UI/Icon/Icon';
import { ColorBox } from '../components/UI/ColorBox/ColorBox';
import { Back } from '../components/UI/Back/Back';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HabitType } from '../types/Habit.d';
import axios from 'axios';
import { Navigation } from '../Layout/Navigation/Navigation';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { AuthHeader } from '../auth/AuthHeader';

export const Habit = () => {
  const habits = useSelector((state: { habit }) => state.habit.habits);
  const [rel, setRel] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!rel) {
      setRel(true);
      return;
    }
    navigate('/habits');
  }, [habits]);

  const habit: HabitType | undefined = habits.find(
    (habit: { _id: string }) => habit._id === params.id
  );

  if (!habit) {
    return <>NO EXIST</>;
  }

  const handleDeleteHabit = () => {
    axios
      .delete(`http://localhost:4000/api/habits/${params.id}`, AuthHeader)
      .then((res) => {
        navigate('/habits');
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  return (
    <>
      <Navigation />
      <ContentWrapper>
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
              <Button color="danger" onClick={handleDeleteHabit}>
                Delete
              </Button>
              <Back />
            </div>
          </>
        )}
      </ContentWrapper>
    </>
  );
};
