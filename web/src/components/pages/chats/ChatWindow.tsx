import { Breakpoint, Typography } from 'antd';
import React, { useState, FC, useMemo, useRef } from 'react';
import MessageInput from './MessageInput';
import EmojiPiker from './EmojiPiker.tsx';
import { EmojiClickData } from 'emoji-picker-react';
import RenderAvatar from './RenderAavtar.tsx';
import dayjs from 'dayjs';
import { darkModeColors, lightModeColors } from '../../utills/index.tsx';

const ChatWindow: FC<{
  screen: Partial<Record<Breakpoint, boolean>>;
  isDark: boolean;
}> = ({ screen, isDark }) => {
  const emojiToggleRef = useRef<{ toggle: () => void }>(null);
  const handelOnSetEmojisRef = useRef<{
    handelOnSetEmojis: (r: string) => void;
  }>(null);

  const emojiPikerProps = useMemo(
    () => ({
      isDark,
      handleSelect: (event: EmojiClickData) => {
        const selectedEmoji = event.emoji;
        // const _content = messageForm.getFieldsValue().content ?? '';
        // messageForm.setFieldsValue({ content: _content + selectedEmoji });
        handelOnSetEmojisRef.current?.handelOnSetEmojis(selectedEmoji);
      },
      ref: emojiToggleRef,
    }),
    []
  );
  return (
    <div
      style={{
        // overflow: 'hidden',
        position: 'relative',
      }}
      className='md:w-3/4 lg:w-3/4 w-full flex flex-col h-full'
    >
      <div
        className={`p-2 flex items-center ${isDark ? 'bg-darkBg' : 'bg-ligthBg'}`}
      >
        <div className='ml-3 mt-2'>
          <RenderAvatar

          // chat={selectedChat}
          // receiver={receiver}
          />
        </div>
        {/* <div className=' ml-3 mt-2'>
            <Typography.Title style={{ marginBottom: 0 }} level={5}>
              {selectedChat?.name || receiver?.name}
            </Typography.Title>
            {selectedChat?.isGroupChat ? null : (receiver as any)?.status
                ?.isOnline ? (
              <span className='text-xs text-gray-500'>Online</span>
            ) : (receiver as any)?.status?.lastSeen ? (
              <span className='text-xs text-gray-500'>
                Last seen {dayjs((receiver as any).status?.lastSeen).fromNow()}
              </span>
            ) : (
              <span className='text-xs text-gray-500'>Offline</span>
            )}
          </div> */}
      </div>
      <div>
        <EmojiPiker {...emojiPikerProps} />
      </div>
      <MessageInput
        {...{
          screen,
          isDark,
          emojiToggleRef,
        }}
      />
    </div>
  );
};

export default ChatWindow;
