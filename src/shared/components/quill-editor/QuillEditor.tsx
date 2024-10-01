// import React, { forwardRef, useImperativeHandle, useRef } from 'react';
// import ReactQuill, { Quill } from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// interface QuillEditorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// // Create a type for the editor methods you want to expose
// export interface QuillEditorRef {
// <<<<<<< Tabnine <<<<<<<
//   getEditor: () => typeof Quill | null; // Make it nullable to handle cases where it's not available//+
// >>>>>>> Tabnine >>>>>>>// {"conversationId":"19fed603-0813-4cb1-a773-022fae62251b","source":"instruct"}
// }

// const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(
//   ({ value, onChange }, ref) => {
//     const quillRef = useRef<ReactQuill | null>(null);

//     useImperativeHandle(ref, () => ({
//       getEditor: () => quillRef.current?.getEditor() || null,
//     }));

//     return (
//       <ReactQuill
//         ref={quillRef}
//         value={value}
//         onChange={onChange}
//         theme="snow"
//       />
//     );
//   }
// );

// export default QuillEditor;