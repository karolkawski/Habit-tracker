// import './Icon.scss';

export const Icon = ({ icon }: { icon: string }) => {
  return (
    <div className="Icon">
      <i className={'fa-solid ' + icon}></i>
    </div>
  );
};
