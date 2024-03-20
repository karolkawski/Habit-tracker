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
  const token = useSelector((state: { user }) => state.user.token);

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
      .delete(
        `http://localhost:4000/api/habits/${params.id}`,
        AuthHeader(token)
      )
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
          <div className="mx-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="font-bold">NO:</div>
              <div>{habit._id}</div>
              <div className="font-bold">Name:</div>
              <div>{habit.name}</div>
              <div className="font-bold">Type</div>
              <div>{habit.type}</div>
              <div className="font-bold">Color:</div>
              <div className="flex">
                <ColorBox color={habit.color} />
              </div>
              <div className="font-bold">Icon:</div>
              <div>
                <Icon icon={habit.icon} />
              </div>
              <div className="font-bold">Frequency:</div>
              <div>{habit.frequency.repeat}</div>
              <div className="font-bold">Days:</div>
              <div className="flex">
                <Frequency size={''} {...habit.frequency} />
              </div>
            </div>
            <div className="flex justify-end mt-10 right-5 bottom-5 fixed md:relative md:right-0">
              <Button color="failure" onClick={handleDeleteHabit}>
                Delete
              </Button>
            </div>
            <Back />
          </div>
        )}
      </ContentWrapper>
    </>
  );
};
