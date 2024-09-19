// import React from 'react';
// import { Tabs, Grid, Card, Avatar, Divider, Typography, Button } from 'antd';
// import { useDarkMode } from '../../thems/useDarkMode';
// import { UserOutlined } from '@ant-design/icons';
// import NavBar from '../home/NavBar';
// const { useBreakpoint } = Grid;
// const { TabPane } = Tabs;

// const UserListTab = () => {
//   const screen = useBreakpoint();
//   const isDark = useDarkMode();

//   const users: any[] = Array.from({ length: 100 }, (_, i) => ({
//     id: i + 1,
//     name: `John Doe ${i + 1}`,
//     avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
//     status: 'online',
//   }));

//   const handleUserTabClick = (key: string) => {};
//   return (
//     <Card
//       bodyStyle={{
//         padding: 0,
//         margin: 0,
//       }}
//       className="card-no-padding"
//       style={{
//         backgroundColor: isDark ? '#171717' : '#f0f2f5',
//         margin: 0,
//         padding: 0,
//         overflow: 'hidden',
//       }}
//     >
//       <Tabs
//         moreIcon={<NavBar />}
//         tabPosition={screen.xs ? 'top' : 'left'}
//         defaultActiveKey="1"
//         onChange={handleUserTabClick}
//         style={screen.xs ? undefined : { height: 558, padding: 0 }}
//         className="tabs-no-padding"
//       >
//         {users.map((user, index) => (
//           <TabPane
//             key={user.name}
//             tab={
//               <Card
//                 style={{
//                   width: screen.xs ? '100%' : 400,
//                   margin: 0,
//                   padding: 0,
//                   border: 'none',
//                   boxShadow: 'none',
//                   backgroundColor: isDark ? '#171717' : '#f0f2f5',
//                 }}
//                 bodyStyle={{
//                   padding: 0,
//                   margin: 0,
//                 }}
//                 className="card-no-padding"
//                 size="small"
//               >
//                 <div
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '20px',
//                   }}
//                 >
//                   <Avatar
//                     src={user.avatar}
//                     style={{ padding: 0 }}
//                     size={60}
//                     icon={<UserOutlined />}
//                   />

//                   <div
//                     style={{
//                       fontSize: '16px',
//                       fontWeight: 'bold',
//                       color: isDark ? '#fff' : '#000',
//                     }}
//                   >
//                     <Typography.Text>{user.name}</Typography.Text>
//                   </div>
//                   <div
//                     style={{
//                       fontSize: '12px',
//                       color: isDark ? '#aaa' : '#888',
//                       position: 'absolute',
//                       right: 10,
//                       marginTop: '20px',
//                     }}
//                   >
//                     <Typography.Paragraph>{user.status}</Typography.Paragraph>
//                   </div>
//                 </div>
//                 <Divider style={{ margin: 0 }} />
//               </Card>
//             }
//             style={{
//               margin: 0,
//               padding: 0,
//             }}
//           />
//         ))}
//       </Tabs>
//     </Card>
//   );
// };

// export default UserListTab;

import React from 'react';
import { Layout, List, Avatar, Grid, AutoCompleteProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserListHeader from './UserListHeader';
import { useDarkMode } from '../../thems/useDarkMode';
const { useBreakpoint } = Grid;
const { Sider } = Layout;

const UserListTab: React.FC<{
  handelOnCreateCharSelect: (r: string) => void;
  isOpenSearchBar: boolean;
  closeSearchBar: () => void;
  openSearchBar: () => void;
  searchOptions: AutoCompleteProps['options'];
  handelOnSearchChange: (r: string) => void;
}> = ({
  handelOnCreateCharSelect,
  isOpenSearchBar,
  closeSearchBar,
  openSearchBar,
  searchOptions,
  handelOnSearchChange,
}) => {
  const screen = useBreakpoint();
  const isDark = useDarkMode();
  const users: any[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `John Doe ${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    status: 'online',
  }));

  return (
    <Layout>
      <Sider
        theme="light"
        width={455}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          insetInlineStart: 0,
          ...(isDark ? { backgroundColor: ' #171717' } : {}),
          top: 0,
          bottom: 0,
          scrollbarWidth: 'thin',
          scrollbarColor: 'auto',
        }}
      >
        <List
          header={
            <UserListHeader
              {...{
                isDark,
                handelOnCreateCharSelect,
                isOpenSearchBar,
                closeSearchBar,
                openSearchBar,
                searchOptions,
                handelOnSearchChange,
              }}
            />
          }
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              onClick={() => console.log(user, 'users')}
              style={{ cursor: 'pointer', padding: '10px 15px' }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar size={50} src={user.avatar} icon={<UserOutlined />} />
                }
                title={user.name}
                description={user.status}
              />
            </List.Item>
          )}
        />
      </Sider>
    </Layout>
  );
};

export default UserListTab;

// <Content style={{ backgroundColor: '#f0f2f5' }}>
//   {selectedUser ? (
//     <div>
//       {/* Chat Header */}
//       <div
//         style={{
//           padding: '10px',
//           backgroundColor: '#fff',
//           borderBottom: '1px solid #ccc',
//         }}
//       >
//         <h3>{selectedUser.name}</h3>
//       </div>

//       {/* Chat Messages */}
//       <div
//         style={{
//           flex: 1,
//           padding: '10px',
//           backgroundColor: '#e5ddd5',
//           overflowY: 'auto',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '10px',
//         }}
//       >
//         {messages
//           .filter((msg) => msg.userId === selectedUser.id)
//           .map((msg, index) => (
//             <div
//               key={index}
//               style={{
//                 alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
//                 backgroundColor: msg.sender === 'me' ? '#dcf8c6' : '#fff',
//                 padding: '10px',
//                 borderRadius: '10px',
//                 maxWidth: '60%',
//               }}
//             >
//               <p style={{ margin: 0 }}>{msg.content}</p>
//               <small style={{ float: 'right', fontSize: '0.8em' }}>
//                 {msg.time}
//               </small>
//             </div>
//           ))}
//       </div>

//       {/* Chat Input */}
//       <div
//         style={{
//           // padding: '10px',
//           backgroundColor: '#fff',
//           borderTop: '1px solid #ccc',
//         }}
//       >
//         <TextArea
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           rows={2}
//           placeholder="Type a message..."
//         />
//         <Button
//           type="primary"
//           icon={<SendOutlined />}
//           onClick={handleSendMessage}
//           style={{ marginTop: '10px', width: '100%' }}
//         >
//           Send
//         </Button>
//       </div>
//     </div>
//   ) : (
//     <div style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>
//       <h2>Select a user to start chatting</h2>
//     </div>
//   )}
// </Content>;
