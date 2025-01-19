import React, { FC, ComponentProps } from 'react';
import './index.css';

const Input: FC<ComponentProps<'input'>> = (props) => {
  return <input {...props} />;
};

export default Input;
