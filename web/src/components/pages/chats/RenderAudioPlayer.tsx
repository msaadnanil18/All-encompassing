import { FC, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { $THEME_C0NFIG } from '../../atoms/root';
import { PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';

const RenderAudioPlayer: FC<{ url?: string }> = ({ url }) => {
  const audioRef = useRef<any>(null);
  const theme = useRecoilValue($THEME_C0NFIG);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (e: any) => {
    const newProgress = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime =
        (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((currentTime / duration) * 100);
    }
  };

  return (
    <div
      className=' mr-3'
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {isPlaying ? (
        <PauseOutlined
          onClick={handlePlayPause}
          style={{ marginRight: '3px', fontSize: '16px' }}
        />
      ) : (
        <PlayCircleOutlined
          onClick={handlePlayPause}
          style={{ marginRight: '3px', fontSize: '16px' }}
        />
      )}

      <input
        type='range'
        min='0'
        max='100'
        value={progress}
        onChange={handleProgressChange}
        style={{
          flex: 1,
          background: `linear-gradient(to right, ${theme.token?.colorPrimary} ${progress}%, #ddd ${progress}%)`,
          appearance: 'none',
          height: '8px',
          borderRadius: '5px',
          outline: 'none',
        }}
      />
      <style>
        {`
      input[type='range']::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: ${theme.token?.colorPrimary}; 
        cursor: pointer;
       
      }
  
    
    `}
      </style>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default RenderAudioPlayer;
