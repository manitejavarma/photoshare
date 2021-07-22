import React, { Component } from 'react'
import './Home.css'
import { connect } from 'react-redux'
import cognitoUtils from '../lib/cognitoUtils'
import UserService from "./services/user-service"
import axios from 'axios'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'


const mapStateToProps = state => {
  return { session: state.session }
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null, 
      images: [],
    }
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentDidMount()  {
    if(typeof(this.props.session.user) !== 'undefined') {
      this.getImages(this.props.session.user.sub)
    }
    console.log(this.state.images)
  }

  onSignOut = (e) => {
    e.preventDefault()
    cognitoUtils.signOutCognitoSession()
  }
  
  getUploadParams = ({ file, meta }) => {
    return { }
  }

  handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  // Handles file upload event and updates state
  handleUpload = (files, allFiles) => {
    if(files[0].meta.status === "done") {
      UserService.uploadImage(this.props.session.user.sub, files[0].file);
      this.setState({file: files[0].file, images: this.state.images})
    }
  }

  getImages(sub) {
    axios.get('/getImages', {
      params: {
         sub: sub
      }
    }).then((response) => {
       //setResponse(response.data)
       console.log(response.data)
       //let jsonReponse = JSON.parse(response.data)
       let jsonReponse = response.data
       for (let i = 1; i < jsonReponse.length; i++) {
         this.setState({file: this.state.file, images: [...this.state.images, jsonReponse[i].data]});
       }
       console.log(this.state.images)
    })
  }
    
  render () {
    return (
      <div className="Home">
          { this.props.session.isLoggedIn ? (
          <div className="App">
            <h1 id="hello_user">Hello {this.props.session.user.userName}, email: {this.props.session.user.email}</h1>
            <hr />
            <Dropzone
              onChangeStatus = {this.handleChangeStatus}
              onSubmit = {this.handleUpload}
              maxFiles = {1}
              inputContent = "Upload or Drag. File"
              accept="image/*"
            />
            {/* <input type="file" onChange={this.handleUpload.bind(this)} /> */}
	          <br/>
            {this.state.images.map(image =>(
                <img src={image}/>
            ))}
	          <p> </p>
            <button id="confirm_button" onClick={this.confirmUpload}>Confirm upload</button>
            <a className="Home-link" href="#" onClick={this.onSignOut}>Sign out</a>
          </div>
          ) : (
            <div id="big_container">
              <div id="container">
                <h1 class="header">Group 25</h1>
                <p class="not_logged_in">You are not logged in!</p>
                <a className="Home-link" href={cognitoUtils.getCognitoSignInUri()}>Sign in</a>
              </div>
            </div>
          )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Home)