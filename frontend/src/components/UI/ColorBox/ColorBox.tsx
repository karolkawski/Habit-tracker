import './ColorBox.scss';

const colorDirectory = {
  '#ffff00': 'yellow',
  '#e40000': 'red',
  '#00ff00': 'green',
  '#0000ff': 'blue',
};

enum colors {
  '#ffff00' = '#ffff00',
  '#e40000' = '#e40000',
  '#00ff00' = '#00ff00',
  '#0000ff' = '#0000ff',
}
export const ColorBox = ({ color }: { color: string }) => {
  return (
    <div className="ColorBox">
      <div
        className={'color-box color-box--' + colorDirectory[color as colors]}
      ></div>
    </div>
  );
};
