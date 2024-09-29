import { Button, Card } from 'antd';
import React from 'react';
import DriveFileUpload from '../../../driveFileUpload';
import { ServiceErrorManager } from '../../../helpers/service';
import { ProfileEditService } from '../../services/auth';
import { $ME } from '../../atoms/root';
import { useRecoilValue } from 'recoil';
const UserProfile = () => {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const me = useRecoilValue($ME);

  const updateProfile = async () => {
    await ServiceErrorManager(
      ProfileEditService({
        data: {
          payload: {
            avatar: avatarUrl,
          },
          query: { _id: me?._id },
        },
      }),
      {}
    );
  };

  return (
    <Card
      className="inline-block"
      //className="w-full h-full"
    >
      <div className="w-80">
        <h1>UserProfile</h1>
        <Card
          onClick={() =>
            document.querySelector<HTMLInputElement>('#file-upload')?.click()
          }
        >
          {avatarUrl ? (
            <img src={avatarUrl} style={{ width: '100%', height: '100%' }} />
          ) : (
            'Avatar'
          )}
        </Card>

        <Button onClick={updateProfile}>Upload</Button>
        <DriveFileUpload
          chooseFiles={(e) => setAvatarUrl(e?.[0]?.url)}
          buttonProps={{
            // @ts-ignore
            style: { display: 'none' },
          }}
        />
      </div>
    </Card>
  );
};

export default UserProfile;
