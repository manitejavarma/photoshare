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
  
  
  // a test method to get all images on click of a button
  const hitBackend = () => {
	  axios.get('/getImages').then((response) => {
			//setResponse(response.data)
			console.log(response.data)
			//let jsonReponse = JSON.parse(response.data)
			let jsonReponse = response.data
			console.log("JSON" , jsonReponse)
			for (let i = 1; i < jsonReponse.length; i++) {
			  console.log(jsonReponse[i].fileName);
			}
			const imgFile = new Blob([jsonReponse[1].data]);
			const imgUrl = URL.createObjectURL(imgFile);
			setResponse(jsonReponse[2].data);
		  })
	  
	  
	  }

  // Handles file upload event and updates state
  function handleUpload(event) {
	const fileToUpload = event.target.files[0]
    

    // Add code here to upload file to server
    // ...
	const encodeImage = (mimetype, arrayBuffer) => {
        let u8 = new Uint8Array(arrayBuffer)
        const b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},''))
        return "data:"+mimetype+";base64,"+b64encoded;
    }

    const uploadImage = async () => {
      const data = new FormData();
      data.append('file', fileToUpload);
      data.append('filename', fileToUpload.name);

      // POST request
      const result = await axios.post('/upload', data, { 
                                        headers: { 'Content-Type': 'multipart/form-data'}
      });
    }

    uploadImage();
  }
  

  return (
    <div id="upload-box">
      <p>{typeof reponse === undefined ? 'loading' : response}</p>
	  <button onClick={hitBackend}>Get Images</button><br/>
      <input type="file" onChange={handleUpload} />
	  <br/>
      <img src={response} />
	  {<p> </p>}
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