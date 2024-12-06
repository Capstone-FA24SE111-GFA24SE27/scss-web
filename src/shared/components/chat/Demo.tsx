import React, { useState } from 'react';
import {ChatQuillEditor} from '../quill-editor';  // Adjust the import path if needed

const ChatApp = () => {
  const [message, setMessage] = useState<string>("");

  // This function will be triggered when an image is uploaded
  const handleImageUpload = (url: string) => {
    console.log('Image uploaded:', url);
    // You can add further logic here, e.g., send the URL to the server or add it to the message content
  };

  // Handle text change
  const handleChange = (value: string) => {
    setMessage(value);
  };

  return (
    <div>
      <h1>Chat Application</h1>
      <ChatQuillEditor 
        value={message} 
        onChange={handleChange} 
        onImageUpload={handleImageUpload}
      />

      <div className="chat-output">
        <p><strong>Message:</strong></p>
        <div>{message}</div>
      </div>
    </div>
  );
};

export default ChatApp;
