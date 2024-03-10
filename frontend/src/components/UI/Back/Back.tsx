import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import './Back.scss';
export const Back = () => {
  return (
    <div className="return-section">
      <Button color="primary">
        <Link to={`/habits`}>Back</Link>
      </Button>
    </div>
  );
};
