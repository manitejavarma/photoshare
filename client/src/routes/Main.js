import React from 'react';
import ImageUploader from 'react-images-upload';
import ReactDOM from "react-dom";
import UploadComponent from "./Upload.jsx";

import "./Main.css";

class Main extends React.Component {
  state = {
    upload: {
      pictures: [],
      maxFileSize: 5242880,
      imgExtension: [".jpg", ".png"],
      defaultImages: [
        "https://media.smarteragent.com/unsafe/http://cdn.photos.sparkplatform.com/fl/20190819183614687947000000-o.jpg",
        "https://media.smarteragent.com/unsafe/http://cdn.photos.sparkplatform.com/fl/20190819183639357715000000-o.jpg",
        "https://media.smarteragent.com/unsafe/http://cdn.photos.sparkplatform.com/fl/20190819183701098384000000-o.jpg"
      ]
    }
  };

  handleChange = files => {
    const { pictures } = this.state.upload;
    console.warn({ pictures, files });

    this.setState(
      {
        ...this.state,
        upload: {
          ...this.state.upload,
          pictures: [...pictures, ...files]
        }
      },
      () => {
        console.warn("It was added!");
      }
    );
  };

  confirmUpload = () => {
    const { pictures, defaultImages } = this.state.upload;
    console.warn("Confirm Upload =>", [...pictures]);
  };

  render() {
    return (
      <div className="App">
        <h1 id="hello_user">Hello [username]</h1>

        <hr />

        <button id="confirm_button" onClick={this.confirmUpload}>Confirm upload</button>

        <UploadComponent
          {...this.state.upload}
          handleChange={this.handleChange}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);

export default Main;