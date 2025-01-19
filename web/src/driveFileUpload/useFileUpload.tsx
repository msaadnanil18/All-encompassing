import React, { useState, useCallback } from 'react';
import UploadFiles from './UploadFiles';
import { addFiles, DriveModes } from '../components/types/addFiles';

type UseUploadFilesReturn = {
  openUploadModal: () => void;
  closeUploadModal: () => void;
  UploadFilesModal: JSX.Element;
};
export const useFileUpload = ({
  chooseFilesCallback,
  uploadType,
}: {
  chooseFilesCallback: (files: addFiles[]) => void;
  uploadType?: DriveModes[];
}): UseUploadFilesReturn => {
  const [visible, setVisible] = useState(false);

  const closeUploadModal = useCallback(() => {
    setVisible(false);
  }, []);
  const openUploadModal = useCallback(() => {
    setVisible(true);
  }, []);
  const UploadFilesModal = (
    <UploadFiles
      {...{ visible, setVisible, chooseFiles: chooseFilesCallback, uploadType }}
    />
  );

  return { openUploadModal, closeUploadModal, UploadFilesModal };
};
