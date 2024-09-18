import React from 'react';
import { Row, Col } from 'antd';
import Chart from './Chart';
import NavBar from '../home/NavBar';
import { useParams } from 'react-router-dom';
import UserListTab from './UserListTab';

const chartApp: React.FC = () => {
  const { id } = useParams();

  return (
    <Row gutter={[0, 0]}>
      {/* <NavBar /> */}
      <Col sm={8}>
        <UserListTab />
      </Col>
      <Col sm={14}>
        <Chart id={id} />
      </Col>
    </Row>
  );
};

export default chartApp;
