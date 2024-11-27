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
    <div className=' grid place-content-center h-screen'>
      <Button type='primary' onClick={openUploadModal}>
        Upload
      </Button>
      {UploadFilesModal}
      <App />
    </div>
  );
};

export default CommentsShows;

const useFirestoreListener = (collectionName: any) => {
  const [data, setData] = React.useState<Array<{}>>([]);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(fireStoreDB, collectionName),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(newData);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return data;
};

const App: React.FC = () => {
  // Initialize state with empty array
  const [data, setData] = useState<Array<{}>>([]);
  console.log(data, 'data');

  // Real-time listener for Firestore
  const firestoreData = useFirestoreListener('component');
  console.log(firestoreData, 'firestoreData');

  // Load initial data from API
  const preData = async () => {
    try {
      const { data } = await Service('/api/saveMainComponentFunction')();
      setData(data.docs);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    preData();
  }, []);

  // Update state whenever Firestore data changes
  useEffect(() => {
    if (firestoreData.length > 0) {
      setData((prev) => [...prev, ...firestoreData]);
    }
  }, [firestoreData]);

  return (
    <div>
      {/* Real-Time Requests Section */}
      <div>
        <Typography.Text>Real-Time Requests</Typography.Text>
        {(data || []).map((item: any) => {
          console.log(item.name, 'itsm');

          return (
            <div key={item._id}>
              <Typography.Paragraph>
                Message: {item.message}
              </Typography.Paragraph>
              <Typography.Paragraph>
                Timestamp: {new Date(item.name).toLocaleString()}
              </Typography.Paragraph>
            </div>
          );
        })}
      </div>

      {/* Form for Sending Data */}
      <Form
        onFinish={async (values) => {
          try {
            const response = await Service('/api/firebase-test')({
              data: values,
            });
            console.log('Data sent successfully:', response);
          } catch (error) {
            console.error('Error sending data:', error);
          }
        }}
      >
        <Form.Item
          name='message'
          label='Message'
          rules={[{ required: true, message: 'Please enter a message' }]}
        >
          <Input />
        </Form.Item>
        <Button htmlType='submit' type='primary'>
          Send
        </Button>
      </Form>
    </div>
  );
};
