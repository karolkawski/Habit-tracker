import { Button, ButtonGroup } from 'flowbite-react';
import { Header } from '../layout/Header/Header';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export const Settings = () => {
  const settings = useSelector((state: { habit }) => state.habit.settings);

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const handleChangeDarmMode = (darkMode: boolean) => {
    fetchSettingsStats();
  };

  const fetchSettingsStats = () => {
    axios
      .post('/api/settings/add', {
        name: 'darkMode',
        value: true,
      })
      .then((res) => {
        setDarkMode(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    const dmode = settings
      ? settings.find((setting) => setting.name === 'darkMode')
      : false;
    if (dmode) {
      setDarkMode(!!dmode.value);
    }
  }, [settings]);
  return (
    <>
      <Header />
      <div>
        <h5>Dark mode</h5>
        <ButtonGroup className="Button__Toggle" aria-label="Basic example">
          <Button
            color={darkMode ? 'primary' : 'secondary'}
            onClick={() => handleChangeDarmMode(true)}
          >
            ON
          </Button>
          <Button
            color={!darkMode ? 'primary' : 'secondary'}
            onClick={() => handleChangeDarmMode(false)}
          >
            OFF
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};
