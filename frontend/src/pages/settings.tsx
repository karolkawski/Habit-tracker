import { Button, ButtonGroup } from 'flowbite-react';
import { Header } from '../layout/Header/Header';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getTokenFromLocalStorage } from '../utils/token';

const config = {
  headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` },
};

export const Settings = () => {
  const darkMode = useSelector(
    (state: { settings }) => state.settings.darkMode
  );

  const handleChangeDarmMode = (darkMode: boolean) => {
    addSetiingsDarkMode(darkMode);
  };

  const addSetiingsDarkMode = (darkMode) => {
    axios
      .post(
        'http://localhost:4000/api/settings/add',
        {
          name: 'darkMode',
          value: darkMode,
        },
        config
      )
      .then((res) => {
        setDarkMode(darkMode);
      })
      .catch((e) => {
        console.error(e);
      });
  };

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
