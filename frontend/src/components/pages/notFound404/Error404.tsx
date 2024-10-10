import { Result } from 'antd';
import React, { FC, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  children?: ReactNode;
}

const Error404: FC<Props> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="all-center h-screen">
      <Result
        status="404"
        title="Oops, we cant find the page"
        subTitle={location.pathname}
        extra={children}
      />
    </div>
  );
};

export default Error404;
