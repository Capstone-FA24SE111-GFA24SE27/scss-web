import React, { useRef, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import './quill-editor.css';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { uploadFile } from '@shared/services';

const ChatQuillEditor = ({
  value,
  onChange,
  onImageUpload,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  onImageUpload: (url: string) => void; // callback to send the image URL
  className?: string;
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle image upload
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      if (input && input.files && input.files[0]) {
        const file = input.files[0];
        const path = `images/${Date.now()}_${file.name}`;

        try {
          const downloadURL = await uploadFile(file, path, (progress) => {
            setUploadProgress(progress);
          });

          // Call the parent onImageUpload callback with the URL
          onImageUpload(downloadURL as string);

          // Optionally insert the image into Quill editor
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, 'image', downloadURL);
            }
          }
        } catch (error) {
          console.error("Image upload failed:", error);
        }
      }
    };
  }, [onImageUpload]);

  const modules = {
    toolbar: {
      container: [], // Only include image option
    },
  };

  return (
    <Box display="flex" alignItems="center" className={className}>
      {/* Left field: Image upload button */}
      <IconButton onClick={handleImageUpload} color="primary">
        <InsertPhotoIcon />
      </IconButton>

      {/* Right field: Quill Editor for text */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Type your message..."
        className="h-40 w-full"
      />

      {/* Progress bar for upload */}
      {uploadProgress > 0 && uploadProgress <= 100 && (
        <Box className="w-full mt-16">
          <Typography color="secondary">Uploading image...</Typography>
          <LinearProgress variant="determinate" value={uploadProgress} color="secondary" />
        </Box>
      )}
    </Box>
  );
};

export default ChatQuillEditor;
