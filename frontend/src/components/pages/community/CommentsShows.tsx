import { Button } from 'antd';

import React from 'react';

const MessageCard = ({
  setComponent,
}: {
  setComponent: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const newRenderCom = () => {
    const [count, setCount] = React.useState(0);
    return (
      <div className=' grid place-content-center h-screen'>
        {count}
        <Button
          onClick={() => {
            setCount((prevCount) => prevCount + 1);
          }}
        >
          Count
        </Button>
      </div>
    );
  };

  React.useEffect(() => {
    // const renderFunction = new Function(
    //   `return (${parseInJson.renderFunction})`
    // )();
    setComponent({ render: newRenderCom });
  }, []);

  return null;
};

const CommentsShows: React.FC = () => {
  const [component, setComponent] = React.useState<any>();

  const RenderedComponent = component?.render;

  return (
    <div>
      check
      <MessageCard setComponent={setComponent} />
      {component && component?.render && <RenderedComponent />}
      {/* {component && (
        <div dangerouslySetInnerHTML={{ __html: component.render() }}></div>
      )} */}
    </div>
  );
};

export default CommentsShows;
