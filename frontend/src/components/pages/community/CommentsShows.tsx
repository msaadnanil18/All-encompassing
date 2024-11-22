import { Button, Form, Input, Typography, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { useFileUpload } from '../../../driveFileUpload/useFileUpload';
import { getDatabase, ref, onValue, onChildAdded } from 'firebase/database';
import { fireStoreDB } from '../../../helpers/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Service from '../../../helpers/service';
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
  const onChooseFiles = (files: any[]) => {
    console.log('Chosen files:', files);
  };

  const { openUploadModal, UploadFilesModal } = useFileUpload({
    chooseFilesCallback: onChooseFiles,
    uploadType: ['images', 'documents', 'camera'],
  });

  return (
    <div>
      <Button type='primary' onClick={openUploadModal}>
        Upload
      </Button>
      {UploadFilesModal}
      <App />
    </div>
  );
};

export default CommentsShows;

const App = () => {
  const [data, setData] = useState<Array<{}>>([]);

  // useEffect(() => {
  //   const requestsRef = ref(fireBaseDatabase, 'requests');
  //   onChildAdded(requestsRef, (snapshot) => {
  //     const response = snapshot.val();
  //     console.log(response, 'response');

  //     const dataList = response
  //       ? Object.keys(response).map((key) => ({
  //           id: key,
  //           ...response[key],
  //         }))
  //       : [];
  //     setData(dataList);
  //   });
  // }, []);

  // useEffect(() => {
  //   const commentsRef = ref(fireBaseDatabase, 'requests');
  //   onChildAdded(commentsRef, (snapshot) => {
  //     const comment = snapshot.val();
  //     console.log(comment, 'resttt');

  //     // setComments((prev) => [...prev, comment]);
  //   });
  // }, []);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     collection(fireStoreDB, 'users'),
  //     (snapshot) => {
  //       const fetchedData = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setData(fetchedData);
  //     }
  //   );

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(fireStoreDB, 'users'),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      }
    );

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     collection(fireStoreDB, 'comment'),
  //     (snapshot) => {
  //       const data = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       console.log(data, '$$$upd'); // Use data as needed
  //     }
  //   );

  //   return () => unsubscribe(); // Cleanup listener
  // }, []);

  return (
    <div>
      <div>
        <Typography.Text>Real-Time Requests</Typography.Text>
        {data.map((item: any) => (
          <div key={item.id}>
            <Typography.Paragraph>Message: {item.message}</Typography.Paragraph>
            <Typography.Paragraph>
              Timestamp: {new Date(item.timestamp).toLocaleString()}
            </Typography.Paragraph>
          </div>
        ))}
      </div>

      <Form
        onFinish={async (e) => {
          const { data } = await Service('/api/firebase-test')({
            data: e,
          });
        }}
      >
        <Form.Item name='message' label='Message'>
          <Input />
        </Form.Item>
        <Button htmlType='submit' type='primary'>
          Send
        </Button>
      </Form>
    </div>
  );
};
