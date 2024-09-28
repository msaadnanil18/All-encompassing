import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const TodoApp = () => {
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
