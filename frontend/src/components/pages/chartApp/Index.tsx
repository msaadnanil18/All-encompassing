import React from 'react';
import { Row, Col } from 'antd';
import Chart from './Chart';
import { useParams } from 'react-router-dom';
import UserListTab from './UserListTab';
import useChats from './hooks/useChats';

const chartApp: React.FC = () => {
  const {
    actions: { handelOnCreateCharSelect, handelOnSearchChange },
    states: { searchOptions },
    togglers: {
      selectUserToChat: { openSearchBar, closeSearchBar, isOpenSearchBar },
    },
  } = useChats();
  const { id } = useParams();

  return (
    <Row gutter={[0, 0]}>
      <Col sm={8}>
        <UserListTab
          {...{
            handelOnCreateCharSelect,
            openSearchBar,
            closeSearchBar,
            isOpenSearchBar,
            searchOptions,
            handelOnSearchChange,
          }}
        />
      </Col>
      <Col sm={14}>
        <Chart id={id} />
      </Col>
    </Row>
  );
};

export default chartApp;
