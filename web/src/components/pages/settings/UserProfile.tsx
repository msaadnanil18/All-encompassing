import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Modal,
  Tooltip,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import { useRecoilState } from 'recoil';
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ServiceErrorManager } from '../../../helpers/service';
import { ProfileEditService } from '../../services/auth';
import { $ME } from '../../atoms/root';
import { getUploadFile } from '../../../driveFileUpload/getUploadFile';
const { Title } = Typography;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as any);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
type FileType = Parameters<any['beforeUpload']>[0];
const UserProfile: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [me, setMe] = useRecoilState($ME);
  const [editedName, setEditedName] = useState<string>(me?.name || '');

  const handelOnEdit = async <T extends { payload: Record<string, any> }>({
    payload,
  }: T) => {
    await ServiceErrorManager(
      ProfileEditService({
        data: {
          payload: { ...payload },
          query: { _id: me?._id },
        },
      }),
      {
        successMessage: 'Your profile is updated',
        failureMessage: 'Error while  updating your profile',
      }
    );
    setMe({
      ...(me || {}),
      _id: me?._id || '',
      username: me?.username || '',
      name: payload.name || me?.name || '',
      email: me?.email || '',
      password: me?.password || '',
      isVerified: me?.isVerified || false,
      avatar: payload.avatar || me?.avatar || '',
      updatedAt: me?.updatedAt || '',
      createdAt: me?.createdAt || '',
      themConfig: me?.themConfig || { token: { colorPrimary: '' } },
    });
  };

  const updateProfile = async () => {
    setUploading(true);
    const file = await getUploadFile({
      file: { file: fileList[0], fileList },
      uploadType: 'cloud1',
    });

    await handelOnEdit({
      payload: { avatar: file?.[0].url },
    });
    setUploading(false);
    setPreviewOpen(false);
  };

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
    handlePreview(newFileList[0]);
  };

  return (
    <Card className='inline-block'>
      <div className='flex flex-col w-80'>
        <div className='flex justify-center'>
          <Upload
            style={{ height: '200px', width: '200px' }}
            onPreview={handlePreview}
            onChange={handleChange}
            fileList={fileList}
            showUploadList={false}
            maxCount={1}
            accept='image/*'
          >
            {me?.avatar ? (
              <img
                src={me?.avatar}
                style={{
                  height: '200px',
                  width: '200px',
                  cursor: 'pointer',
                  borderRadius: '100px',
                }}
              />
            ) : (
              <Avatar icon={<UserOutlined />} size={170} />
            )}
          </Upload>
        </div>
        <div className='space-y-8'>
          <div>
            <span style={{ color: me?.themConfig?.token?.colorPrimary }}>
              Your Name
            </span>
            {isEditName ? (
              <div className='flex justify-between'>
                <input
                  value={editedName}
                  style={{
                    fontSize: '16px',
                    border: 'none',
                    borderBottom: '2px solid #ccc',
                    outline: 'none',
                    backgroundColor: 'transparent',
                  }}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <CheckOutlined
                  onClick={async () => {
                    await handelOnEdit({
                      payload: {
                        name: editedName,
                      },
                    });
                    setIsEditName(false);
                  }}
                  className='cursor-pointer'
                />
              </div>
            ) : (
              <div className='flex justify-between'>
                <Title className='mt-3' level={5}>
                  {me?.name}
                </Title>
                <EditOutlined
                  onClick={() => setIsEditName(true)}
                  className='cursor-pointer'
                />
              </div>
            )}
          </div>
          <div className='flex items-center justify-between'>
            <span style={{ color: me?.themConfig?.token?.colorPrimary }}>
              Username
            </span>
            <div className='flex justify-between'>
              <Title className='mt-3' level={5}>
                {me?.username}
              </Title>
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={previewOpen}
        title={previewTitle}
        closeIcon={
          <Button type='text' disabled={uploading} icon={<CloseOutlined />} />
        }
        onCancel={() => setPreviewOpen(false)}
        width={600}
        cancelButtonProps={{
          style: { visibility: 'hidden' },
        }}
        onOk={() => updateProfile()}
        okButtonProps={{
          type: 'text',
          loading: uploading,
          disabled: uploading,
        }}
        okText={
          <Tooltip title='Uplaod Avatar'>
            <CheckOutlined style={{ fontSize: '18px' }} />
          </Tooltip>
        }
      >
        <img alt='preview' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Card>
  );
};

export default UserProfile;
