import React, { FC, useState } from 'react';
import {
  ArrowRightOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  Input,
  Upload,
  Modal,
  UploadFile,
  FormInstance,
  UploadProps,
} from 'antd';

type FileType = Parameters<any['beforeUpload']>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as any);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const GroupCreateForm: FC<{
  chatForm: FormInstance;
  handelOnCancel: () => void;
  createGroupChat: () => Promise<void>;
  submitLoading: boolean;
}> = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    );
    setPreviewOpen(true);
  };

  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  return (
    <>
      <Form layout='vertical' form={props.chatForm}>
        <Form.Item name='members' noStyle />
        <Form.Item className='flex justify-center' name='groupAvatar'>
          <Upload
            listType='picture-circle'
            onPreview={handlePreview}
            onChange={handleChange}
            fileList={fileList}
            maxCount={1}
          >
            {fileList.length < 1 && (
              <button style={{ border: 0, background: 'none' }} type='button'>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Avatar</div>
              </button>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label='Group Name' name='name' required>
          <Input placeholder='Enter group name' />
        </Form.Item>
        <Divider />
        <div className='flex gap-2 h-12 items-center justify-end'>
          <Button
            onClick={props.handelOnCancel}
            icon={<CloseOutlined />}
            type='dashed'
          >
            Cancel
          </Button>
          <Button
            disabled={props.submitLoading}
            loading={props.submitLoading}
            onClick={async () => {
              await props.createGroupChat();
              props.handelOnCancel();
            }}
            type='primary'
          >
            Create
            <ArrowRightOutlined />
          </Button>
        </div>
      </Form>
      <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt='preview' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default GroupCreateForm;
