import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Button, Progress, message, Typography, Spin } from 'antd';
import { PlusSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import WebcamMain from 'react-webcam';
import axios, { AxiosProgressEvent } from 'axios';
import { UploadFile } from 'antd/es/upload/interface';
import { addFiles } from '../components/types/addFiles';
import { fileUplaodService } from '../components/services/fileUpload';

const isFrontCamera = (device: MediaDeviceInfo) => {
  return (
    (device?.label || '').includes('front') ||
    (device?.label || '').includes('FaceTime HD')
  );
};

const WebCamUpload = ({ addFiles }: { addFiles: (file: addFiles) => void }) => {
  const [progress, setProgress] = useState<{
    [key: string]: { percentCompleted: number; file: UploadFile };
  }>({});
  const [selectedDevice, setSelectedDevice] = React.useState<
    MediaDeviceInfo | any
  >(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<addFiles & { data: File }>
  >([]);
  const webcamRef = useRef<WebcamMain>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
    const videoInputDevices = mediaDevices.filter(
      ({ kind }) => kind === 'videoinput'
    );

    const frontCameras = videoInputDevices.filter(isFrontCamera);
    if (frontCameras.length > 0) {
      setSelectedDevice(frontCameras[0]);
    } else if (videoInputDevices.length > 0) {
      setSelectedDevice(videoInputDevices[0]);
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const uploadFiles = async (fileList: UploadFile[]) => {
    try {
      setLoading(true);
      await Promise.all(
        fileList.map(async (file) => {
          const { uid, originFileObj } = file;
          if (!uid || !originFileObj) return;
          const { data } = await fileUplaodService();
          const formData = new FormData();
          formData.append('file', originFileObj);
          formData.append('api_key', data.api_key);
          formData.append('timestamp', data.timestamp);
          formData.append('signature', data.signature);
          formData.append('cloud_name', data.cloud_name);

          const uploadResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${data.cloud_name}/upload`,
            formData,
            {
              onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                const totalSize = progressEvent.total || file.size;
                if (!totalSize) return;
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / totalSize
                );
                setProgress((prevProgress) => ({
                  ...prevProgress,
                  [uid]: { percentCompleted, file },
                }));
              },
            }
          );

          const uploadedFile = {
            asset_id: uploadResponse.data.asset_id,
            format: uploadResponse.data.format,
            api_key: uploadResponse.data.api_key,
            url: uploadResponse.data.url,
            bytes: uploadResponse.data.bytes,
            resource_type: uploadResponse.data.resource_type,
            original_filename: uploadResponse.data.original_filename,
            data: originFileObj,
          };

          addFiles(uploadedFile);
          setUploadedFiles((prev) => [...prev, uploadedFile]);
          setProgress({});
        })
      );
    } catch (error) {
      message.error('Error uploading files');
    } finally {
      setLoading(false);
    }
  };

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    const file = await fetch(imageSrc)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' })
      );

    await uploadFiles([{ uid: file.name, originFileObj: file } as UploadFile]);
  };

  const removeUploadedFile = (fileToRemove: addFiles & { data: File }) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.asset_id !== fileToRemove.asset_id)
    );
  };

  return (
    <Spin spinning={loading}>
      <div className="grid place-content-center">
        <WebcamMain
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
          videoConstraints={{ deviceId: selectedDevice?.deviceId }}
          mirrored={isFrontCamera(selectedDevice)}
        />
        <Button
          onClick={capture}
          icon={<PlusSquareOutlined />}
          style={{
            position: 'absolute',
            left: '50%',
            top: '90%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {uploadedFiles.length > 0 && (
          <div className="p-8">
            {uploadedFiles.map((file) => (
              <div key={file.asset_id} className="flex items-center mb-2">
                <Typography.Text
                  type="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUploadedFile(file);
                  }}
                >
                  <DeleteOutlined className="mr-2" />
                </Typography.Text>
                <Typography.Text>{file.data.name}</Typography.Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </Spin>
  );
};

export default WebCamUpload;
