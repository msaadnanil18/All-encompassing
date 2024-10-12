import { Modal } from 'antd';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { $THEME_C0NFIG } from '../../atoms/root';
import { SendOutlined } from '@ant-design/icons';
import './chats.css';
import { addFiles } from '../../types/addFiles';
import RenderAttachments from '../../../driveFileUpload/ReanderAttachments.';

const AttachmentsView: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: React.ChangeEventHandler;
  value: string;
  send: () => void;
  attachments: addFiles[];
}> = (prop) => {
  const { isModalOpen, setIsModalOpen, value, onChange, send, attachments } =
    prop;
  const theme = useRecoilValue($THEME_C0NFIG);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <Modal
      centered
      open={isModalOpen}
      cancelButtonProps={{ style: { visibility: 'hidden' } }}
      onOk={() => {
        send();
        setIsModalOpen(false);
      }}
      okButtonProps={{
        icon: <SendOutlined />,
        ...(value.trim().length > 0 ? {} : { style: { visibility: 'hidden' } }),
      }}
      okText='Send'
      onCancel={() => setIsModalOpen(false)}
    >
      {(attachments || []).map((file, index) => (
        <div>
          <RenderAttachments
            width={'200px'}
            height={'150px'}
            key={index}
            url={file.url}
          />
        </div>
      ))}
      <div className='input-container'>
        <input
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className='input-field'
          type='text'
        />
        <label
          htmlFor='input-field'
          className='input-label'
          style={{
            color: isFocused ? theme.token?.colorPrimary : '#ccc',
          }}
        >
          Captions
        </label>
        <span
          className='input-highlight'
          style={{
            backgroundColor: isFocused ? theme.token?.colorPrimary : '#ccc',
          }}
        ></span>
      </div>
    </Modal>
  );
};

export default React.memo(AttachmentsView);
