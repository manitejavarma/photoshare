import React, { Component } from 'react'
import './Home.css'
import { connect } from 'react-redux'
import cognitoUtils from '../lib/cognitoUtils'
import UserService from "./services/user-service"
import axios from 'axios'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const mapStateToProps = state => {
  return { session: state.session }
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploaded: false,
      images: []
    }
    this.handleUpload = this.handleUpload.bind(this)
    this.setUploaded = this.setUploaded.bind(this)
  }
  
  componentDidMount()  {
    if(this.props.session.isLoggedIn) {
      this.getImages(this.props.session.user.sub)
    }
  }

  setUploaded = (val) => {
    this.setState({
      uploaded: val,
      images: this.state.images
    })
  }

  onSignOut = (e) => {
    e.preventDefault()
    cognitoUtils.signOutCognitoSession()
  }

  handleChangeStatus = ({ meta }, status) => {
    // console.log(status)
  }

  // Handles file upload event and updates state
  handleUpload = (files, allFiles) => {
    if(files[0].meta.status === "done") {
      UserService.uploadImage(this.props.session.user.sub, files[0].file)
      .then(result => {
        this.getImages(this.props.session.user.sub, true)
        files[0].remove()
      })
      
    }
  }

  getImages(sub, upload = false) {
    axios.get('/getImages', {
      params: {
         sub: sub
      }
    }).then((response) => {
       let jsonReponse = response.data
       const img = []
       for (let i = 1; i < jsonReponse.length; i++) {
         img[i] = jsonReponse[i].data
       }
      this.setState({uploaded: upload, images: img})
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
	          <br/>
            {this.state.uploaded ? <Alert variant="success" onClose= {() => this.setUploaded(false)} dismissible>The image was uploaded successfully!</Alert>: null}
            {this.state.images.map(image =>(
                <img src={image}/>
            ))}
	          <p> </p>
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