import { Button, Input, Typography } from 'antd';
import TicketCard from './TicketToken';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';

const NextPage = () => {
  return (
    <div
      style={{
        overflow: 'hidden',
        height: '100vh',
      }}
      className='flex flex-col'
    >
      {/* Header with Create Section */}
      <div
        style={{
          padding: '10px',
          borderBottom: '1px solid #ddd',
        }}
        className='flex flex-row justify-between items-center'
      >
        <Typography.Title level={2} style={{ margin: 0 }}>
          Tickets
        </Typography.Title>
        <div className='flex space-x-3'>
          <Input
            placeholder='Enter details'
            style={{
              width: 250,
            }}
          />
          <Button icon={<ReloadOutlined />} />
          <Button type='primary'>Create</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-grow'>
        {/* Ticket Card */}
        <TicketCard />

        {/* Right Panel */}
        <div className='md:w-1/4 lg:w-1/4 w-full h-full flex flex-col'>
          <div className=' flex items-center justify-between'>
            <div className=' ml-3 mt-2'>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                Filters
              </Typography.Title>
            </div>
            <div className='mr-3 mt-2'>
              <Button icon={<SearchOutlined />}></Button>
            </div>
          </div>
          <div
            style={{
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              height: 'calc(90vh - 100px)',
            }}
            className=' p-4'
          >
            {Array.from({ length: 20 }, (_, i) => i).map((_, i) => (
              <div className='mb-3'>
                <Input placeholder='Search' />
              </div>
            ))}
          </div>
          <div className=' p-2 w-full'>
            <Button type='primary' block>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextPage;
