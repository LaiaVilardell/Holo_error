import React from 'react';

interface Props {
  hairColor: string;
}

const HairShort: React.FC<Props> = ({ hairColor }) => {
  return (
    <g id="hair-short">
      <path 
        d="M 50,60 C 50,20 150,20 150,60 Q 150,70 140,80 C 120,90 80,90 60,80 Q 50,70 50,60 z"
        fill={hairColor}
      />
    </g>
  );
};

export default HairShort;
