import React, {
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import EmojiPicker from 'emoji-picker-react';

interface EmojiPikerProps {
  handleSelect: (
    event: React.MouseEvent,
    emojiObject: { emoji: string }
  ) => void;
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
      <React.Fragment>
        {isOpen && (
          <div style={{ width: '100%', padding: 0, float: 'right' }}>
            <EmojiPicker
              onEmojiClick={handleSelect as any}
              theme={isDark ? 'dark' : ('light' as any)}
              width="100%"
              style={{ padding: 0 }}
              searchDisabled
              skinTonesDisabled
            />
          </div>
        )}
      </React.Fragment>
    );
  }
);

export default EmojiPiker;
