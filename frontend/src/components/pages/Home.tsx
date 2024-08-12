import React from 'react';
import { Button, Card, Form, Input, Row, Col } from 'antd';
import Service from '../../helpers/service';

const Home = () => {
  const handleOnSubmit = async (value: Record<string, any>) => {
    try {
      const formData = new FormData();
      formData.append('username', value.username);
      formData.append('email', value.email);
      formData.append('password', value.password);
      formData.append('name', value.name);
      const response = Service('/api/register')({
        data: {
          payload: {
            ...value,
          },
        },
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Row>
      <Col span={8}></Col>
      <Col sm={8} className="mt-20">
        <Card className="w-full h-full">
          <Form onFinish={handleOnSubmit} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: 'Please enter name',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: 'Please enter username',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Email is required',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="mt-4">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Home;
