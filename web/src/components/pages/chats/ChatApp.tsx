import { Grid } from 'antd';
import Sidebar from './SideBar';
import ChatWindow from './ChatWindow';
import { useDarkMode } from '../../thems/useDarkMode';
const { useBreakpoint } = Grid;

const ChatApp = () => {
  const isDark = useDarkMode();
  const screen = useBreakpoint();
  return (
    <div className='h-screen md:flex lg:flex'>
      <Sidebar {...{ isDark, screen }} />
      {!screen.xs && <ChatWindow {...{ screen, isDark }} />}
    </div>
  );
};

export default ChatApp;
