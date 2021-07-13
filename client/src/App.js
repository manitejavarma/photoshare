import React from "react";
import axios from 'axios'

const {useState, useCallback} = React;

/**
 * Component to handle file upload. Works for image
 * uploads, but can be edited to work for any file.
 */
function FileUpload() {
  // State to store uploaded file
  const [file, setFile] = React.useState("");
  const [response, setResponse] = React.useState(null)
  const [imagesData, setImagesData] = useState([]);
  
  
  // a test method to get all images on click of a button
  
  const getImages = () => {
	  const imagesList = ["download.png", "download.jpg","cat.png","timetable.PNG","course registration.png","1626142757157pei.jpg"];
	  axios.get('/getImages',{
		   params: {
			images: JSON.stringify(imagesList)
		  }
	  }).then((response) => {
			//setResponse(response.data)
			console.log(response.data)
			//let jsonReponse = JSON.parse(response.data)
			let jsonReponse = response.data
			for (let i = 1; i < jsonReponse.length; i++) {
			  setImagesData(imagesData => [...imagesData, jsonReponse[i].data]);
			}
			console.log(imagesData)
		  })
	  
	  }

  // Handles file upload event and updates state
  function handleUpload(event) {
	const fileToUpload = event.target.files[0]
    

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
	  <button onClick={getImages}>Get Images</button><br/>
      <input type="file" onChange={handleUpload} />
	  <br/>
	  //Right now showing only one image, show all images later
      <img src={imagesData[4]} />
	  {<p> </p>}
    </div>
  );
}

export default function App() {
  return <FileUpload />;
}