import React, { FC, Dispatch, SetStateAction } from 'react';
import { Form, FormInstance, Input } from 'antd';

const MessageInput: FC<{
  form: FormInstance;
}> = ({ form }) => {
  return (
    <Form form={form} style={{ width: '100%' }}>
      <Form.Item name='message' noStyle>
        <Input
          // onKeyDown={(e) => {
          //   if (e.key === 'Enter') {
          //     send();
          //   }
          // }}
          className='flex-grow mr-2'
          style={{ padding: '8px', borderRadius: '9px' }}
        />
      </Form.Item>
    </Form>
  );
};

export default React.memo(MessageInput);
