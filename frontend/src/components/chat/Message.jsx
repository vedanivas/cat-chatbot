import ReactMardkown from 'react-markdown';
import clsx from 'clsx';

const Message = ({ message, isUser }) => {
  return (
    <div
      className={clsx(
        'flex mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={clsx(
          'max-w-[85%] rounded-lg p-4',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800'
        )}
      >
        <ReactMardkown>{message.content}</ReactMardkown>
      </div>
    </div>
  );
};

export default Message;