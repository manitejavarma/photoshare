import React, { Component } from 'react'
import logo from './logo.svg'
import './Home.css'
import { connect } from 'react-redux'
import cognitoUtils from '../lib/cognitoUtils'
import ImageUploader from 'react-images-upload'
import UploadComponent from "./Upload.jsx"

const mapStateToProps = state => {
  return { session: state.session }
}

class Home extends Component {

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

  onSignOut = (e) => {
    e.preventDefault()
    cognitoUtils.signOutCognitoSession()
  }

  render () {
    return (
      <div className="Home">
          { this.props.session.isLoggedIn ? (
          <div className="App">
            <h1 id="hello_user">Hello {this.props.session.user.userName}, email: {this.props.session.user.email}</h1>
            <hr />
            <button id="confirm_button" onClick={this.confirmUpload}>Confirm upload</button>
            <UploadComponent
              {...this.state.upload}
              handleChange={this.handleChange}
            />
            <a className="Home-link" href="#" onClick={this.onSignOut}>Sign out</a>
          </div>
          ) : (
            <div>
              <p>You are not logged in.</p>
              <a className="Home-link" href={cognitoUtils.getCognitoSignInUri()}>Sign in</a>
            </div>
          )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Home)