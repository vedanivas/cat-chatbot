const Message = ({ sender, content }) => {
  return (
    <div className={`message ${sender}`}>
      <div className="message-content">{content}</div>
    </div>
  );
};

export default Message;
