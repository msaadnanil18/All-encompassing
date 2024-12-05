// src/dummyData.ts
export const chatList = [
  { id: 1, name: 'John Doe', message: 'Hello!', time: '10:30 AM' },
  { id: 2, name: 'Jane Smith', message: 'How are you?', time: '10:35 AM' },
  { id: 3, name: 'Bob Johnson', message: 'Meeting at 3 PM', time: '10:40 AM' },
  {
    id: 4,
    name: 'Alice Brown',
    message: 'Can you review this?',
    time: '10:50 AM',
  },
  {
    id: 5,
    name: 'Charlie White',
    message: 'Let’s catch up later!',
    time: '11:00 AM',
  },
  {
    id: 6,
    name: 'David Green',
    message: 'Thanks for the update!',
    time: '11:10 AM',
  },
];

export const chatMessages = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  sender: i % 2 === 0 ? 'me' : 'them',
  message: `This is a test message ${i + 1}`,
  time: `10:${(i % 60).toString().padStart(2, '0')} AM`,
}));
