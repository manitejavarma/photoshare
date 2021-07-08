import React from "react";
import axios from 'axios'

/**
 * Component to handle file upload. Works for image
 * uploads, but can be edited to work for any file.
 */
function FileUpload() {
  // State to store uploaded file
  const [file, setFile] = React.useState("");
  const [response, setResponse] = React.useState(null)

  // Handles file upload event and updates state
  function handleUpload(event) {
    setFile(event.target.files[0]);

    // Add code here to upload file to server
    // ...
  }
  const hitBackend = () => {axios.get('/testAPI').then((response) => {setResponse(response.data)})}

  return (
    <div id="upload-box">
      <button onClick={hitBackend}>Send request</button>
      <p>{typeof reponse === undefined ? 'loading' : response}</p>
      <input type="file" onChange={handleUpload} />
      <p>Filename: {file.name}</p>
      <p>File type: {file.type}</p>
      <p>File size: {file.size} bytes</p>
      {file && <ImageThumb image={file} />}
    </div>
  );
}

/**
 * Component to display thumbnail of image.
 */
const ImageThumb = ({ image }) => {
  return <img src={URL.createObjectURL(image)} alt={image.name} />;
};


export default function App() {
  return <FileUpload />;
}