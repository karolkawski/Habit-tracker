import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export const Back = () => {
  return (
    <div className="return-section">
      <Link to={`/habits`}>
        <Button color="secondary">Back</Button>
      </Link>
    </div>
  );
};