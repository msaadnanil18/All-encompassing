import { Modal } from 'antd';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { $THEME_C0NFIG } from '../../atoms/root';
import { SendOutlined } from '@ant-design/icons';

const AttachmentsView: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: React.ChangeEventHandler;
  value: string;
  send: () => void;
}> = (prop) => {
  const { isModalOpen, setIsModalOpen, value, onChange, send } = prop;
  const theme = useRecoilValue($THEME_C0NFIG);

  React.useEffect(() => {
    const inputField = document.querySelector(
      '.input-field'
    ) as HTMLInputElement | null;
    const inputLabel = document.querySelector(
      '.input-label'
    ) as HTMLLabelElement | null;
    const inputHighlight = document.querySelector(
      '.input-highlight'
    ) as HTMLSpanElement | null;

    if (
      inputField &&
      inputLabel &&
      inputHighlight &&
      theme.token?.colorPrimary
    ) {
      inputField?.addEventListener('focus', () => {
        inputLabel!.style.color = (theme.token?.colorPrimary).toString();
        inputHighlight!.style.backgroundColor =
          (theme.token?.colorPrimary).toString();
      });
      inputField?.addEventListener('blur', () => {
        inputLabel!.style.color = '#ccc';
        inputHighlight!.style.backgroundColor = '#ccc';
      });
    }
  }, [theme]);

  return (
    <Modal
      centered
      open={isModalOpen}
      cancelButtonProps={{ style: { visibility: 'hidden' } }}
      onOk={() => send()}
      okButtonProps={{ icon: <SendOutlined /> }}
      okText="Send"
      onCancel={() => setIsModalOpen(false)}
    >
      <div className="input-container">
        <input
          value={value}
          onChange={onChange}
          className="input-field"
          type="text"
        />
        <label htmlFor="input-field" className="input-label">
          Captions
        </label>
        <span className="input-highlight"></span>
      </div>

      {/* <input
      placeholder="Caption"
      className="block w-full p-2.5 text-base border-b-2 border-gray-300 outline-none bg-transparent focus:ring-0 focus:border-blue-500"
      type="text"
    /> */}
    </Modal>
  );
};

export default React.memo(AttachmentsView);
