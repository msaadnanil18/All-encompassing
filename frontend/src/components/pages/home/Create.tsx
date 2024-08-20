import React from 'react';
import { Button, Card, Form, Input, Row, Col, notification } from 'antd';
import Service from '../../../helpers/service';
import { PlusCircleOutlined } from '@ant-design/icons';

const Create: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const handleOnSubmit = async (value: Record<string, any>) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', value.username);
      formData.append('email', value.email);
      formData.append('password', value.password);
      formData.append('name', value.name);
      const response = await Service('/api/register')({
        data: {
          payload: {
            ...value,
          },
        },
      });
      notification.success({
        message: 'User created',
        description: response.data.message,
      });
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'something went wrong while register the user',
      });
      console.log(error);
    } finally {
      setLoading(false);
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
            <Form.Item style={{ margin: 0 }}>
              <Button
                icon={<PlusCircleOutlined />}
                type="primary"
                htmlType="submit"
                className="mt-4"
                loading={loading}
              >
                Register account
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Create;
