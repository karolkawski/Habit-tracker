import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import {
  fetchDataRequest,
  fetchDataSuccess,
} from '../store/actions/habitActions';
import { Navigation } from '../Layout/Navigation/Navigation';
import { Button, Table } from 'flowbite-react';
import { ColorBox } from '../components/UI/ColorBox/ColorBox';
import { Frequency } from '../components/UI/Frequency/Frequency';
import { Link } from 'react-router-dom';
import { Icon } from '../components/UI/Icon/Icon';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { AuthHeader } from '../auth/AuthHeader';
import { Header } from '../components/UI/Header/Header';
import { TableCustomTheme } from '../theme/TableCustomTheme';
import { ButtonCustomTheme } from '../theme/ButtonCustomTheme';

export const Habits = () => {
  const dispatch = useDispatch();
  const habits = useSelector((state: { habit }) => state.habit.habits);
  const token = useSelector((state: { user }) => state.user.token);

  const fetchHabits = async () => {
    dispatch(fetchDataRequest());

    try {
      const fetchedHabits = await axios.get(
        'http://localhost:4000/api/habits',
        AuthHeader(token)
      );
      if (fetchedHabits) {
        dispatch(fetchDataSuccess(fetchedHabits.data));
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchHabits();
  }, []);

  if (!habits) {
    return (
      <>
        <Navigation />
        <ContentWrapper>
          <div className="flex justify-center mt-5">
            <Button theme={ButtonCustomTheme} color="secondary">
              <Link to={`/add`}>Add </Link>
            </Button>
          </div>
        </ContentWrapper>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <ContentWrapper>
        <Header title={'Habits'} />
        <Table theme={TableCustomTheme}>
          <Table.Head>
            <Table.HeadCell className="py-1 px-[8px] md:p-1.5">
              Name
            </Table.HeadCell>
            <Table.HeadCell className="py-1 px-[8px] md:p-1.5 hidden md:block">
              Type
            </Table.HeadCell>
            <Table.HeadCell className="text-center py-1 px-[8px] md:p-1.5">
              Color
            </Table.HeadCell>
            <Table.HeadCell className="text-center py-1 px-[8px] md:p-1.5 hidden md:block">
              Icon
            </Table.HeadCell>
            <Table.HeadCell className="text-center py-1 px-[8px] md:p-1.5">
              Frequency
            </Table.HeadCell>
            <Table.HeadCell className="flex justify-end py-1 px-[8px] md:p-1.5">
              Action
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {habits &&
              habits.map((item) => (
                <Table.Row
                  key={item._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white py-1 px-[8px] md:p-1.5">
                    <Link to={`/habits/${item._id}`}>{item.name}</Link>
                  </Table.Cell>
                  <Table.Cell className="py-1 px-[8px] md:p-1.5 hidden md:block">
                    {' '}
                    {item.type}
                  </Table.Cell>
                  <Table.Cell className="py-1 px-[8px] md:p-1.5">
                    <ColorBox color={item.color} />
                  </Table.Cell>
                  <Table.Cell className="text-center py-1 px-[8px] md:p-1.5 hidden md:block">
                    <Icon icon={item.icon} />
                  </Table.Cell>
                  <Table.Cell className="text-left py-1 px-[8px] md:p-1.5">
                    <Frequency
                      size="s"
                      days={item.frequency.days}
                      repeat={item.frequency.repeat}
                    />
                  </Table.Cell>
                  <Table.Cell className="flex justify-end py-1 px-[8px] md:p-1.5">
                    <Button theme={ButtonCustomTheme} color="secondary">
                      <Link to={`/habits/${item._id}/edit`}>Edit</Link>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <div className="flex justify-end my-5 px-[6px]">
          <Button theme={ButtonCustomTheme} color="secondary">
            <Link to={`/add`}>Add </Link>
          </Button>
        </div>
      </ContentWrapper>
    </>
  );
};
