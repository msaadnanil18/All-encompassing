import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Typography } from 'antd';
import React from 'react';
import Service from '../../../helpers/service';
import socket from '../../../helpers/socket';

const Chart = ({ id }: { id: string | undefined }) => {
  const [messages, setMessages] = React.useState<string[]>([]);
  const [input, setInput] = React.useState('');
  const [receiverId, setReceiverId] = React.useState<string>('');

  console.log(id, '_______ID____');

  React.useEffect(() => {
    socket.on('getMessage', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${data.senderId}: ${data.text}`,
      ]);
    });

    return () => {
      socket.off('getMessage');
    };
  }, []);

  const sendMessage = () => {
    if (id) {
      socket.emit('sendMessage', {
        senderId: id,
        receiverId,
        text: input,
      });
      setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
      setInput('');
    }
  };
  return (
    // <div className=" grid place-content-center h-screens">
    //   <Typography.Text>Chart</Typography.Text>

    //   <Button
    //     onClick={async () => {
    //       const data = await Service('/api/char-app')({
    //         data: {
    //           payload: {},
    //         },
    //       });
    //       console.log(data);
    //     }}
    //     icon={<UploadOutlined />}
    //   ></Button>

    //   <h1>Socket.IO Chat</h1>
    //   <div>
    //     {messages.map((msg, index) => (
    //       <Typography.Paragraph key={index}>{msg}</Typography.Paragraph>
    //     ))}
    //   </div>
    //   <Input
    //     type="text"
    //     value={input}
    //     onChange={(e) => setInput(e.target.value)}
    //     onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
    //   />
    //   <Button onClick={sendMessage}>Send</Button>
    // </div>
    <div>
      <div>
        <div>
          <h2>Private Chat</h2>
          <input
            type="text"
            placeholder="Receiver User ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />
          <div>
            {messages.map((msg, index) => (
              <Typography.Paragraph key={index}>{msg}</Typography.Paragraph>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Chart;
