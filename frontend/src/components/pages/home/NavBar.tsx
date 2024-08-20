// import { Menu } from 'antd';
// import React from 'react';

// const NavBar: React.FC = () => {
//   return (
//     <React.Fragment>
//       <Menu
//         mode="horizontal"
//         style={{ height: '50px', lineHeight: '50px', fontSize: '18px' }}
//       ></Menu>
//     </React.Fragment>
//   );
// };

// export default NavBar;

import React from 'react';
import {
  Menu,
  Avatar,
  Typography,
  Button,
  Dropdown,
  Space,
  MenuProps,
  Drawer,
  Grid,
} from 'antd';
const { useBreakpoint } = Grid;
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  VideoCameraAddOutlined,
  YoutubeFilled,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

const NavBar = () => {
  const screen = useBreakpoint();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const menuStyle = {
    height: '50px',
    lineHeight: '50px',
    fontSize: '18px',
  };

  const items: MenuProps['items'] = [
    {
      label: <div onClick={() => navigate('/login-user')}>Login User</div>,
      key: '0',
      icon: <LoginOutlined style={{ fontSize: 15 }} />,
    },
    {
      label: (
        <div onClick={() => navigate('/resgister-user')}>Resgister User</div>
      ),
      key: '1',
      icon: <UserAddOutlined style={{ fontSize: 15 }} />,
    },
    {
      label: <div onClick={() => setOpen(true)}>Resgister User</div>,
      icon: <VideoCameraAddOutlined style={{ fontSize: 15 }} />,
      key: '2',
    },
  ];

  return (
    <>
      <Menu mode="horizontal" style={menuStyle}>
        <Menu.Item key="icon" disabled>
          <UnorderedListOutlined style={{ padding: 14, fontSize: 27 }} />
          <YoutubeFilled
            style={{ padding: 14, fontSize: 27, color: 'red', margin: 0 }}
            onClick={() => navigate('/')}
          />
        </Menu.Item>

        <Menu.Item key="name" disabled></Menu.Item>

        <Menu.Item key="logout" disabled style={{ marginLeft: 'auto' }}>
          {screen.sm ? (
            <Button
              className="mx-10"
              onClick={() => setOpen(true)}
              type="link"
              icon={<VideoCameraAddOutlined style={{ fontSize: 23 }} />}
            />
          ) : null}

          <Button type="link" icon={<LogoutOutlined />} danger>
            Logout
          </Button>
        </Menu.Item>

        <Menu.Item key="avatar" disabled>
          <Dropdown menu={{ items }} trigger={['click']}>
            <Avatar
              style={{ backgroundColor: '#8a8686' }}
              size="large"
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default NavBar;
