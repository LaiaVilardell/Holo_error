import React from 'react';

interface Props {
  skinTone: string;
}

const Face: React.FC<Props> = ({ skinTone }) => {
  return (
    <g id="face">
      <circle cx="100" cy="100" r="85" fill={skinTone} stroke="#333" strokeWidth="2" />
    </g>
  );
};

export default Face;
