import { Button } from 'antd';
import React, { FC } from 'react';
import Error404 from './Error404';

interface NotFound404Props {
  home?: string;
}
const NotFound404: FC<NotFound404Props> = ({ home }) => {
  return (
    <Error404>
      <div>
        <Button></Button>
      </div>
    </Error404>
  );
};

export default NotFound404;
