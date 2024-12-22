import React, { FC } from 'react';
import {
  PlusOutlined,
  DownOutlined,
  CameraOutlined,
  FileOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';

const AddAttachments: FC = () => {
  const menu = (
    <Menu>
      <Menu.Item key='photos'>
        <span>
          <PictureOutlined className='text-blue-500 text-xl mr-3' />
          Photos
        </span>
      </Menu.Item>
      <Menu.Item key='videos'>
        <span>
          <VideoCameraOutlined className='text-green-500 text-xl mr-3' />
          Videos
        </span>
      </Menu.Item>
      <Menu.Item key='camera'>
        <span>
          <CameraOutlined className='text-red-500 text-xl mr-3' />
          Camera
        </span>
      </Menu.Item>
      <Menu.Item key='documents'>
        <span>
          <FileOutlined className='text-purple-500 text-xl mr-3' />
          Documents
        </span>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} placement='topLeft' trigger={['click']}>
      <Button
        type='text'
        shape='circle'
        icon={<PlusOutlined style={{ fontSize: '20px' }} />}
        //   onClick={() => {
        //     if ((emojiToggleRef as any).current) {
        //       (emojiToggleRef as any).current.toggle();
        //     }
        //   }}
      />
    </Dropdown>
  );
};

export default AddAttachments;
