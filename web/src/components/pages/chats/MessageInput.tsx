import {
  AudioOutlined,
  DeleteOutlined,
  PauseOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Breakpoint, Button, Card, Form, FormInstance, Input } from 'antd';
import React, { FC, Ref, useEffect, useRef, useState } from 'react';
import { getBackgroundColor } from '../../utills';
import AddAttachments from './AddAttachments';
import './css/index.css';
import RenderAudioPlayer from './RenderAudioPlayer';
import { useRecoilValue } from 'recoil';
import { $THEME_C0NFIG } from '../../atoms/root';

const MessageInput: FC<{
  screen: Partial<Record<Breakpoint, boolean>>;
  messageOnSend: (r: string) => Promise<void>;
  messageForm: FormInstance;
  isDark: boolean;
  emojiToggleRef: Ref<{
    toggle: () => void;
  }>;
}> = (props) => {
  const { screen } = props;
  const theme = useRecoilValue($THEME_C0NFIG);
  const [message, setMessage] = useState<string>('');
  const [attachments, setAttachments] = useState<Array<{}> | null>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<any>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [waveAnimation, setWaveAnimation] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setWaveAnimation(true);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setTimer(0);
      setWaveAnimation(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support audio recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(chunks.current, {
          type: 'audio/ogg; codecs=opus',
        });
        chunks.current = [];
        setAudioBlob(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const deleteAudio = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setTimer(0);
  };

  const handleSendMessage = async () => {
    setMessage('');
    await props.messageOnSend(message);
    inputRef.current?.focus();
  };

  return (
    <Card
      bodyStyle={{ padding: '16px' }}
      bordered={false}
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: getBackgroundColor(props.isDark),
        borderRadius: 0,
      }}
      size={screen.xs ? 'small' : 'default'}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          height: '100%',
        }}
      >
        <AddAttachments />

        <Button
          type='text'
          shape='circle'
          icon={<SmileOutlined style={{ fontSize: '20px' }} />}
          onClick={() => {
            if ((props.emojiToggleRef as any).current) {
              (props.emojiToggleRef as any).current.toggle();
            }
          }}
        />
        <div className='w-full'>
          {isRecording && (
            <div className=' flex space-x-2'>
              <div style={{ fontSize: '10px' }}>
                {`${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}
              </div>

              {waveAnimation && (
                <div className=' items-center flex w-full space-x-3'>
                  <div
                    className='wave-animation'
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '20px',

                      backgroundColor: '#f0f0f0',
                      borderRadius: theme.token?.borderRadius,
                      width: '100%',
                    }}
                  >
                    <div
                      style={{ background: theme.token?.colorPrimary }}
                      className='wave'
                    />
                    <div
                      style={{ background: theme.token?.colorPrimary }}
                      className='wave'
                    />
                    <div
                      style={{ background: theme.token?.colorPrimary }}
                      className='wave'
                    />
                  </div>
                  <Button
                    size='small'
                    onClick={stopRecording}
                    icon={<PauseOutlined />}
                  />
                </div>
              )}
            </div>
          )}
          {!isRecording && !audioBlob && (
            <Form form={props.messageForm}>
              <Form.Item name='attachments' noStyle />
              <Form.Item noStyle name='content'>
                <Input
                  ref={inputRef}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault(); // Prevent newline
                      await handleSendMessage();
                    }
                  }}
                  value={message}
                  placeholder='Type a message...'
                  style={{ padding: '7px', fontSize: '14px' }}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Form.Item>
            </Form>
          )}
          {audioBlob && (
            <div className=' float-right flex space-x-3'>
              <Button
                size='small'
                onClick={deleteAudio}
                danger
                icon={<DeleteOutlined />}
              />
              <RenderAudioPlayer url={audioURL ?? undefined} />
            </div>
          )}
        </div>

        {message.trim()?.length > 0 ||
        audioBlob ||
        (attachments || [])?.length > 0 ? (
          <Button
            icon={<SendOutlined />}
            shape='circle'
            onClick={handleSendMessage}
            style={{ display: 'inline-flex' }}
          />
        ) : (
          !isRecording && (
            <Button
              icon={<AudioOutlined />}
              shape='circle'
              onClick={startRecording}
            />
          )
        )}
      </div>
    </Card>
  );
};

export default React.memo(MessageInput);
