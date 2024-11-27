import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const generateObjectId = (): string => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = Math.random().toString(16).substring(2, 10).padEnd(16, '0');
  return (timestamp + random).substring(0, 24); // Ensure 24 characters
};
const TodoApp = () => {
  const messageId = '';

  console.log(messageId, 'messageId');

  const newDocument = {
    name: 'Sample Document',
    createdAt: new Date().toISOString(),
  };

  console.log(newDocument);

  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <Button
        onClick={() => {
          navigate(`/todo-app--/${id}/next-page`);
        }}
      >
        Next page
      </Button>
    </div>
  );
};

export default TodoApp;
