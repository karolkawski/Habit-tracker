import { Button, ButtonGroup } from 'flowbite-react';
import { Navigation } from '../Layout/Navigation/Navigation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ContentWrapper } from '../Layout/ContentWrapper';
import { AuthHeader } from '../auth/AuthHeader';

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
        AuthHeader
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
      <Navigation />
      <ContentWrapper>
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
      </ContentWrapper>
    </>
  );
};
