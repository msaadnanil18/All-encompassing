import React from 'react';
import { Button, Form, Row, Col, Card, Input } from 'antd';
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { me, logIn, loading } = useAuth();

  React.useEffect(() => {
    if (me) {
      navigate(`/dash-board/${me?._id}`);
    }
  }, [me]);

  const formOnSubmit = async (value: Record<string, any>) => {
    await logIn(value);
  };
  return (
    <Row>
      <Col span={8}></Col>
      <Col sm={8} xs={24} className=" mt-40">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className=" w-full h-full">
            <Form layout="vertical" onFinish={formOnSubmit}>
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={24}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      { required: true, message: 'Please enter username' },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Please enter password' },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Col>
                  <Button
                    icon={<LoginOutlined />}
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Log-in
                  </Button>
                </Col>
                <Col sm={17}>
                  <Button
                    style={{ float: 'right' }}
                    type="link"
                    icon={<UserAddOutlined />}
                    onClick={() => {
                      navigate('/resgister-user');
                    }}
                  >
                    Create your Account
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </motion.div>
      </Col>
    </Row>
  );
};

export default Login;
