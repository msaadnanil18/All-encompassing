import React, {
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface EmojiPikerProps {
  handleSelect: (event: EmojiClickData) => void;
  isDark: boolean;
}

const EmojiPiker = forwardRef<{ toggle: () => void }, EmojiPikerProps>(
  ({ handleSelect, isDark }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    useImperativeHandle(ref, () => ({
      toggle,
    }));

    return (
      <>
        {isOpen && (
          <div style={{ width: '100%', padding: 0, float: 'right' }}>
            <EmojiPicker
              onEmojiClick={handleSelect as any}
              theme={isDark ? Theme.DARK : Theme.LIGHT}
              width='100%'
              style={{ padding: 0 }}
              searchDisabled
              skinTonesDisabled
            />
          </div>
        )}
      </>
    );
  }
);

export default React.memo(EmojiPiker);
