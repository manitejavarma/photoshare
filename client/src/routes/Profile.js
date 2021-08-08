import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import cognitoUtils from '../lib/cognitoUtils'
import UserService from "./services/user-service"
import axios from 'axios'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { Alert, Navbar, Container, Nav, ModalTitle, ModalBody, ModalFooter } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import './Home.css'
import { Button } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import ModalHeader from 'react-bootstrap/esm/ModalHeader'

const mapStateToProps = state => {
  return { session: state.session }
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploaded: false,
      images: [],
      isOpen: false,
      largeImageSrc: '',
      showFriends: false,
      friends: []
    }
    this.handleUpload = this.handleUpload.bind(this)
    this.setUploaded = this.setUploaded.bind(this)
  }

  componentDidMount() {
    if (this.props.session.isLoggedIn) {
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
    if (files[0].meta.status === "done") {
      UserService.uploadImage(this.props.session.user.sub, this.props.session.user.userName, files[0].file, this.props.session.credentials.idToken)
        .then(result => {
          const img = {
            fileName: result.data[1].fileName,
            imageSrc: result.data[1].data
          }

          this.setState(prevState => ({
            uploaded: true,
            images: [img, ...prevState.images]
          }))
          files[0].remove()
        })

    }
  } 

  setLargeImage = (fileName) => e => {
    axios.get('/getImage', {
      params: {
        fileName: fileName
      }
    }).then((response) => {
      let jsonResponse = response.data
      const img = []
      for (let i = 1; i < jsonResponse.length; i++) {
        let temp_img = {
          fileName: jsonResponse[i].fileName,
          imageSrc: jsonResponse[i].data
        }
        img.push(temp_img)
        // img[i] = jsonResponse[i].data
      }
      // console.log(img[0].imageSrc);
      this.setState({ isOpen: true, largeImageSrc: img[0].imageSrc })
      // this.setState({ uploaded: upload, images: img })
    })
    // this.setState({ isOpen: true, largeImageSrc: e.target.currentSrc })
  }

  getFriends(sub) {
    axios.get('/getFriends', {
      params: {
        sub : sub,
        token: this.props.session.credentials.idToken
      }
    }).then((response) => {
      console.log("Rsp:" + response)
      let jsonResponse = response.data
      const f = []
      for (let i = 0; i < jsonResponse.length; i++) {
        f.push(jsonResponse[i])
      }
      this.setState({ friends: f })
    })
    this.setState({ showFriends: true})
  }

  getImages(sub, upload = false) {
    axios.get('/getImages', {
      params: {
        sub: sub,
        token: this.props.session.credentials.idToken
      }
    }).then((response) => {
      let jsonResponse = response.data
      const img = []
      for (let i = 1; i < jsonResponse.length; i++) {
        let temp_img = {
          fileName: jsonResponse[i].fileName,
          imageSrc: jsonResponse[i].data
        }
        img.push(temp_img)
        // img[i] = jsonResponse[i].data
      }
      this.setState({ images: img })
    })
  }

  render() {
    return (
      <div className="Home">
        {this.props.session.isLoggedIn ? (
          <div className="App">
          {/* Navbar component, copy this to any other page */}
          <Navbar className="custom-navbar">
            <Nav className="me-auto">
              <Navbar.Brand href="#home">
                Photoshare
              </Navbar.Brand>
            </Nav>
            <Nav className="ml-auto">
              <LinkContainer exact to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
              <LinkContainer exact to="/profile"><Nav.Link>Profile</Nav.Link></LinkContainer>
              <Nav.Link onClick={this.onSignOut}>Sign Out</Nav.Link>
            </Nav>
            </Navbar>
            <h1 id="hello_user">Hello {this.props.session.user.userName}, email: {this.props.session.user.email}</h1>
            {console.log(this.props.session)}
            <div class="text-center">
              <Button variant="primary" class="text-center" onClick={() => this.getFriends(this.props.session.user.sub)}> My Friends </Button>
            </div>
            <div>
              <Modal show={this.state.showFriends}>
                <ModalHeader>
                  <ModalTitle>My Friends</ModalTitle>
                </ModalHeader>
                <Modal.Body>
                  {this.state.friends.map(friend => (
                    <p> {friend} </p>
                  ))}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={() => this.setState({ showFriends: false })}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div>
            <br/>
            <div id="upload">
              <div id="upload-button">
                <Dropzone
                  onChangeStatus={this.handleChangeStatus}
                  onSubmit={this.handleUpload}
                  maxFiles={1}
                  inputContent="Upload or Drag Image"
                  accept="image/*"
                />
              </div>
            </div>
            <br />
            {this.state.uploaded ? <Alert variant="success" onClose={() => this.setUploaded(false)} dismissible>The image was uploaded successfully!</Alert> : null}
            <section id="image-container">
              {/* Display all images here */}
              {this.state.images.map(image => (
                <div className="image-div">
                  <img className="image" src={image.imageSrc} alt={image.fileName} onClick={this.setLargeImage(image.fileName)} />
                </div>
              ))}
            </section>

            {/* Open the modal to display large image */}
            {this.state.isOpen && (
              <Lightbox
                mainSrc={this.state.largeImageSrc}
                onCloseRequest={() => this.setState({ isOpen: false })}
              />
            )}
            <br/>
          </div>
        ) : (
          <div id="container">
            <div id="container-information">
              <h1 class="header">Photoshare</h1>
              <p class="not_logged_in">You are not signed in.</p>
              <a className="Home-link" href={cognitoUtils.getCognitoSignInUri()}><button id="login-btn">Sign In</button></a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps)(Home)
