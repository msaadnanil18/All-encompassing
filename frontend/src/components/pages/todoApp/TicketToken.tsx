import { Pagination } from 'antd';
import React from 'react';

const TicketCard = ({
  title = 'Customer needs a report for the Cameras that are not connecting #7755',
  description = 'Customer responded a day ago',
  assignees = ['John Doe', 'Jane Doe'],
  status = 'Pending',
  priority = 'Medium',
  tags = ['Selera', 'DIAGNOSTICS', 'MASTER_PORTAL'],
  onStatusChange,
}: any) => {
  const statusColors = {
    'Customer responded': 'bg-blue-100 text-blue-500',
    Pending: 'bg-yellow-100 text-yellow-500',
    Resolved: 'bg-green-100 text-green-500',
  };

  const priorityColors = {
    Low: 'text-green-500',
    Medium: 'text-yellow-500',
    High: 'text-red-500',
    Urgent: 'text-red-700',
  };

  return (
    <div className='md:w-3/4 lg:w-3/4'>
      <div
        style={{
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          height: 'calc(100vh - 80px)',
        }}
        className=' p-4  '
      >
        {Array.from({ length: 20 }, (_, i) => i).map((_, i) => (
          <div
            key={i}
            className='flex items-center justify-between bg-white  p-2 border border-gray-200 hover:shadow-lg transition duration-300 mb-2'
          >
            <div className='flex items-start gap-4'>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${statusColors['Customer responded']}`}
              >
                Customer responded
              </span>

              {/* Ticket Information */}
              <div className='flex flex-col'>
                {/* Title */}
                <h3 className='text-sm font-medium text-gray-800'>{title}</h3>

                <div className=' flex'>
                  <p className='text-sm font-medium text-gray-700'>
                    Assigned to:
                  </p>
                  <div className='flex gap-2 '>
                    {assignees.map((assignee, index) => (
                      <span
                        key={index}
                        className='text-xs bg-blue-100 text-blue-600 px-1 py-1 ml-1 '
                      >
                        {assignee}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className='flex gap-2 mt-2'>
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Priority and Status */}
            <div className='flex flex-col items-end'>
              {/* Priority */}
              <span
                className={`text-sm font-medium ${priorityColors[priority]}`}
              >
                {priority}
              </span>

              {/* Status Dropdown */}
              <div className='text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md border mt-2'>
                {status}
              </div>
            </div>
          </div>
        ))}
        {/* <div></div> */}
        <Pagination className=' float-right' />
      </div>
    </div>
  );
};

export default TicketCard;
