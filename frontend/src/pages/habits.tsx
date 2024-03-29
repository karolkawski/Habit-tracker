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

  const fetchHabits = async () => {
    dispatch(fetchDataRequest());

    try {
      const fetchedHabits = await axios.get(
        'http://localhost:4000/api/habits',
        AuthHeader
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
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell className="text-center">Color</Table.HeadCell>
            <Table.HeadCell className="text-center">Icon</Table.HeadCell>
            <Table.HeadCell className="text-center">Frequency</Table.HeadCell>
            <Table.HeadCell className="flex justify-end">Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {habits &&
              habits.map((item) => (
                <Table.Row
                  key={item._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link to={`/habits/${item._id}`}>{item.name}</Link>
                  </Table.Cell>
                  <Table.Cell> {item.type}</Table.Cell>
                  <Table.Cell>
                    <ColorBox color={item.color} />
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    <Icon icon={item.icon} />
                  </Table.Cell>
                  <Table.Cell className="text-left">
                    <Frequency
                      size="s"
                      days={item.frequency.days}
                      repeat={item.frequency.repeat}
                    />
                  </Table.Cell>
                  <Table.Cell className="flex justify-end">
                    <Button theme={ButtonCustomTheme} color="secondary">
                      <Link to={`/habits/${item._id}/edit`}>Edit</Link>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <div className="flex justify-end my-5 px-4 md:px-6">
          <Button theme={ButtonCustomTheme} color="secondary">
            <Link to={`/add`}>Add </Link>
          </Button>
        </div>
      </ContentWrapper>
    </>
  );
};
