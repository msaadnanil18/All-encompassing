import { Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logOut } = useAuth();
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          navigate(`/chat-app--/${id}`);
        }}
      >
        Chat app
      </Button>
      <Button
        onClick={() => {
          navigate(`/todo-app--/${id}`);
        }}
      >
        Todo app
      </Button>
      <div style={{ float: 'right' }} className=" space-x-1">
        <Button icon={<LogoutOutlined />} onClick={logOut} />
        <Button
          onClick={() => navigate(`/setting--/${id}`)}
          icon={<SettingOutlined />}
        />
      </div>
    </div>
  );
};

export default Home;
