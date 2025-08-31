import React from 'react';

interface Props {
  hairColor: string;
}

const HairLong: React.FC<Props> = ({ hairColor }) => {
  return (
    <g id="hair-long">
      <path 
        d="M 40,60 C 40,10 160,10 160,60 V 150 C 160,180 120,190 100,180 C 80,190 40,180 40,150 z"
        fill={hairColor}
      />
    </g>
  );
};

export default HairLong;
