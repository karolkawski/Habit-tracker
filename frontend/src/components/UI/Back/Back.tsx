import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { ButtonCustomTheme } from '../../../theme/ButtonCustomTheme';
export const Back = () => {
  return (
    <div className="mt-10 left-5 bottom-5 fixed">
      <Button theme={ButtonCustomTheme} color="secondary">
        <Link to={`/habits`}>Back</Link>
      </Button>
    </div>
  );
};
