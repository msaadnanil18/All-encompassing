import React, { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
  notification,
  Modal,
  UploadFile,
  Upload,
} from 'antd';
import { userRegisterService } from '../../services/auth';
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ServiceErrorManager } from '../../../helpers/service';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBase64, FileType } from '../../utills';
import { getUploadFile } from '../../../driveFileUpload/getUploadFile';

const Create: React.FC = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = React.useState<boolean>(false);
  const handleOnSubmit = async (value: Record<string, any>) => {
    setLoading(true);
    try {
      let file = null;
      if (value.avatar) {
        file = await getUploadFile({
          file: value.avatar,
          uploadType: 'cloud2',
        });
      }

      const [err] = await ServiceErrorManager(
        userRegisterService({
          data: {
            payload: {
              ...value,
              avatar: file?.[0]?.url,
            },
          },
        }),
        {
          successMessage: 'You successfully created you account',
          failureMessage: 'Error while creating account',
        }
      );
      if (err) return;
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=' h-screen flex items-center justify-center'>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className=' md:w-[500px] w-80'>
          <Modal
            visible={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            <img alt='preview' style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Form onFinish={handleOnSubmit} layout='vertical'>
            <Form.Item
              className='flex justify-center m-0'
              style={{ margin: 0 }}
              name='avatar'
            >
              <Upload
                listType='picture-circle'
                onPreview={handlePreview}
                onChange={handleChange}
                fileList={fileList}
                maxCount={1}
                accept='image/*'
              >
                {fileList.length < 1 && (
                  <button
                    style={{ border: 0, background: 'none' }}
                    type='button'
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Avatar</div>
                  </button>
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              name='name'
              label='Name'
              rules={[
                {
                  required: true,
                  message: 'Please enter name',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='username'
              label='Username'
              rules={[
                {
                  required: true,
                  message: 'Please enter username',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='email'
              label='Email'
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Email is required',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='password'
              label='Password'
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item noStyle>
              <Button
                icon={<PlusCircleOutlined />}
                type='primary'
                htmlType='submit'
                className='mt-4'
                loading={loading}
              >
                Register account
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Create;
