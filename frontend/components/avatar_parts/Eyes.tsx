import React from 'react';

interface Props {
  eyeColor: string;
}

const Eyes: React.FC<Props> = ({ eyeColor }) => {
  return (
    <g id="eyes">
      <circle cx="80" cy="88" r="10" fill="white" />
      <circle cx="80" cy="88" r="5" fill={eyeColor} />
      <circle cx="120" cy="88" r="10" fill="white" />
      <circle cx="120" cy="88" r="5" fill={eyeColor} />
    </g>
  );
};

export default Eyes;
