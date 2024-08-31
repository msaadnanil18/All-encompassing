// import { UploadOutlined } from '@ant-design/icons';
// import { Button, Input, Typography } from 'antd';
// import React from 'react';
// import Service from '../../../helpers/service';
// import socket from '../../../helpers/socket';

// const CONNECTED_EVENT = 'connected';
// const DISCONNECT_EVENT = 'disconnect';
// const JOIN_CHAT_EVENT = 'joinChat';

// const Chart = ({ id }: { id: string | undefined }) => {
//  const { socket } = useSocket();

//   const [messages, setMessages] = React.useState<string[]>([]);
//   const [input, setInput] = React.useState('');
//   const [receiverId, setReceiverId] = React.useState<string>('');

//   const [isConnected, setIsConnected] = React.useState(false);
//   console.log(id, '_______ID____');

//   const onConnect = () => {
//     setIsConnected(true);
//   };

//   const connectSoket = () => {

//   }
//   React.useEffect(() => {

//     socket.on(CONNECTED_EVENT, onConnect);
//     // socket.on('getMessage', (data) => {
//     //   setMessages((prevMessages) => [
//     //     ...prevMessages,
//     //     `${data.senderId}: ${data.text}`,
//     //   ]);
//     // });

//     // return () => {
//     //   socket.off('getMessage');
//     // };
//   }, []);

//   const sendMessage = () => {
//     if (id) {
//       socket.emit('sendMessage', {
//         senderId: id,
//         receiverId,
//         text: input,
//       });
//       setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
//       setInput('');
//     }
//   };
//   return (
//     // <div className=" grid place-content-center h-screens">
//     //   <Typography.Text>Chart</Typography.Text>

//     //   <Button
//     //     onClick={async () => {
//     //       const data = await Service('/api/char-app')({
//     //         data: {
//     //           payload: {},
//     //         },
//     //       });
//     //       console.log(data);
//     //     }}
//     //     icon={<UploadOutlined />}
//     //   ></Button>

//     //   <h1>Socket.IO Chat</h1>
//     //   <div>
//     //     {messages.map((msg, index) => (
//     //       <Typography.Paragraph key={index}>{msg}</Typography.Paragraph>
//     //     ))}
//     //   </div>
//     //   <Input
//     //     type="text"
//     //     value={input}
//     //     onChange={(e) => setInput(e.target.value)}
//     //     onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//     //   />
//     //   <Button onClick={sendMessage}>Send</Button>
//     // </div>
//     <div>
//       <div>
//         <div>
//           <h2>Private Chat</h2>
//           <input
//             type="text"
//             placeholder="Receiver User ID"
//             value={receiverId}
//             onChange={(e) => setReceiverId(e.target.value)}
//           />
//           <div>
//             {messages.map((msg, index) => (
//               <Typography.Paragraph key={index}>{msg}</Typography.Paragraph>
//             ))}
//           </div>
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//           />
//           <Button onClick={sendMessage}>Send</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chart;

import { SendOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import socket from '../../../helpers/socket';
import { ChatListItemInterface } from '../../types/charts';

const CONNECTED_EVENT = 'connected';
const DISCONNECT_EVENT = 'disconnect';
const JOIN_CHAT_EVENT = 'joinChat';
const NEW_CHAT_EVENT = 'newChat';
const Chart = ({ id }: { id: string | undefined }) => {
  const [message, setMessage] = useState<string>('');
  const [chats, setChats] = useState<ChatListItemInterface[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selfTyping, setSelfTyping] = useState<boolean>(false);
  const currentChat = React.useRef<any>();
  const onConnect = (value: any) => {
    setIsConnected(true);
  };

  console.log(chats, 'chat');

  const sendChatMessage = () => {
    socket.emit('SendMessage', {
      text: message,
    });
    setMessage('');
  };

  const handleOnMessageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage(e.target.value);
    if (!isConnected) return;

    if (!selfTyping) {
      setSelfTyping(true);
    }
  };

  const onNewChat = (chat: ChatListItemInterface) => {
    setChats((prev) => [chat, ...prev]);
  };

  const connectSoket = () => {
    socket.on(CONNECTED_EVENT, onConnect);
    socket.on(NEW_CHAT_EVENT, onNewChat);
  };

  const getMessages = () => {
    socket.emit(JOIN_CHAT_EVENT, id);
  };

  useEffect(() => {
    if (id) {
      currentChat.current = id;

      socket?.emit(JOIN_CHAT_EVENT, id);

      getMessages();
    }
  }, []);

  useEffect(() => {
    connectSoket();
  }, []);

  return (
    <div
      className="fixed bottom-0 right-0 p-4 flex items-center"
      style={{ width: '45rem' }}
    >
      <Input
        value={message}
        onChange={handleOnMessageChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendChatMessage();
          }
        }}
        className="flex-grow mr-2"
      />
      <Button onClick={sendChatMessage} icon={<SendOutlined />} />
    </div>
  );
};

export default Chart;
