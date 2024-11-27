import React from 'react';
import { FileOutlined, FileImageFilled } from '@ant-design/icons';
import { Button, Drawer, Typography } from 'antd';
import { useTogglers } from '../components/hooks/togglers';

interface IProps {
  url: string | undefined;
  style?: React.CSSProperties;
  className?: string;
  type?: string;
  width?: string | number;
  height?: string | number;
  inLine?: boolean;
}

const RederPdf: React.FC<IProps> = ({
  url,
  style,
  className,
  type,
  width,
  height,
}) => {
  return (
    <iframe
      src={url}
      width={width ? width : '100%'}
      height={height ? height : '100%'}
      style={style}
      className={className}
    ></iframe>
  );
};

const RenderVideo: React.FC<IProps> = ({ url, width }) => {
  return (
    <video src={url} preload='none' width={width ? width : '100%'} controls />
  );
};

const RenderImage: React.FC<IProps> = ({ url, width, height }) => {
  return (
    <img
      src={url}
      alt='Attachment'
      width={width ? width : '100%'}
      height={height ? height : '100%'}
      style={{
        objectFit: 'contain',
      }}
    />
  );
};

const Renders: React.FC<IProps> = (prop) => {
  const { url } = prop;
  const extension = url?.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'mp4':
    case 'mkv':
    case 'webm':
      return <RenderVideo {...prop} />;

    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      return <RenderImage {...prop} />;

    case 'mp3':
    case 'wav':
    case 'ogg':
      return <audio src={url} preload='none' controls />;

    case 'pdf':
      return (
        <a href={url} target='_blank' rel='noopener noreferrer'>
          <RederPdf type='application/pdf' {...prop} /> PDF File
        </a>
      );

    case 'doc':
    case 'docx':
      return (
        <a href={url} target='_blank' rel='noopener noreferrer'>
          <FileOutlined /> Word Document
        </a>
      );

    case 'xls':
    case 'xlsx':
      return (
        <a href={url} target='_blank' rel='noopener noreferrer'>
          <FileOutlined /> Excel File
        </a>
      );

    default:
      return (
        <div>
          <embed src={url} />

          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <Button
              size='small'
              type='link'
              onClick={() => {
                const anchor = document.createElement('a');
                anchor.href = url as any;
                anchor.download = ''; //
                anchor.target = '_blank';
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
              }}
            >
              Download File
            </Button>
          </div>
        </div>
      );
  }
};

const RenderAttachments: React.FC<IProps> = (prop) => {
  const { state: isOpen, open, close } = useTogglers();
  if (prop.inLine) {
    return (
      <div>
        <Button onClick={open} type='link'>
          Attachments
        </Button>
        <Drawer width={1000} footer={null} open={isOpen} onClose={close}>
          <Renders {...prop} />
        </Drawer>
      </div>
    );
  }
  return <Renders {...prop} />;
};

export default RenderAttachments;
