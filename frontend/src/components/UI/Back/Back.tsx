import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { ButtonCustomTheme } from '../../../theme/ButtonCustomTheme';
export const Back = () => {
  return (
    <div className="mr-5">
      <Link to={`/habits`}>
        <Button theme={ButtonCustomTheme} color="secondary">
          Back
        </Button>
      </Link>
    </div>
  );
};
