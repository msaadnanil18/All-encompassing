import { UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import { head, startCase } from 'lodash-es';
import React, { FC } from 'react';
import { User } from '../../types/partialUser';
import { ChatListItem } from './types';

const RenderAvatar: FC<{
  chat?: ChatListItem | null;
  receiver?: User;
}> = ({ chat, receiver }) => {
  return chat?.groupChat ? (
    chat?.groupAvatar ? (
      <Avatar
        size={40}
        src={
          <img
            src={chat.groupAvatar}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          />
        }
      />
    ) : (
      <Avatar size={40} icon={<UsergroupAddOutlined />} />
    )
  ) : (
    <Badge
      dot
      {...((receiver as any)?.status?.isOnline
        ? { color: 'green' }
        : { color: 'red' })}
    >
      {receiver?.avatar ? (
        <Avatar size={40} src={receiver.avatar} />
      ) : (
        <Avatar
          size={40}
          style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
        >
          {head(startCase(receiver?.name))}
        </Avatar>
      )}
    </Badge>
  );
};

export default RenderAvatar;
