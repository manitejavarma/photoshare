import React, { Component } from 'react'
import { connect } from 'react-redux'
import cognitoUtils from '../lib/cognitoUtils'
import axios from 'axios'
import 'react-dropzone-uploader/dist/styles.css'
import { Navbar, Nav, ModalTitle, Button, Modal } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import './Home.css'
import { FaUserCircle } from 'react-icons/fa';
import ModalHeader from 'react-bootstrap/esm/ModalHeader'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const mapStateToProps = state => {
  return { session: state.session }
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      isOpen: false,
      largeImageSrc: '',
      userImages: [],
      viewUser: false,
      currUserView: ''
    }
  }


  componentDidMount() {
    if (this.props.session.isLoggedIn) {
      this.getAllImages()
    }
  }

  onSignOut = (e) => {
    e.preventDefault()
    cognitoUtils.signOutCognitoSession()
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
  }

  getAllImages() {
    axios.get('/getAllImages', {
      params: {
        token: this.props.session.credentials.idToken
      }
    }).then((response) => {
      let jsonResponse = response.data
      const img = []
      for (let i = 1; i < jsonResponse.length; i++) {
        let temp_img = {
          fileName: jsonResponse[i].fileName,
          imageSrc: jsonResponse[i].data,
          user: jsonResponse[i].by
        }
        img.push(temp_img)
      }
      this.setState({ images: img })
    })
  }

  getUserImages(username) {
    axios.get('/getAllImages', {
      params: {
        token: this.props.session.credentials.idToken
      }
    }).then((response) => {
      let jsonResponse = response.data
      const img = []
      for (let i = 1; i < jsonResponse.length; i++) {
        if (jsonResponse[i].by === username) {
          let temp_img = {
            fileName: jsonResponse[i].fileName,
            imageSrc: jsonResponse[i].data,
            user: jsonResponse[i].by 
          }
          img.push(temp_img)
        }
        this.setState({ userImages: img, viewUser: true, currUserView: username })
      }
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
            <br />
            <h3 id="shared">Shared by others</h3>
            <br/>
            <section id="image-container">
              {/* Display all images here */}
              {this.state.images.map(image => (
                <div className="image-div">
                  <img className="image" src={image.imageSrc} alt={image.user} onClick={this.setLargeImage(image.fileName)} />
                  <div className="name"><FaUserCircle /> <Link to={{pathname: "user", query: {username: image.user}}} className='name-link'>{image.user}</Link></div>
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
            <div>
              <Modal show={this.state.viewUser}>
                <ModalHeader>
                  <ModalTitle>{this.state.currUserView}'s Profile</ModalTitle>
                  <button type="button" class="btn-close" onClick={() => this.setState({ viewUser: false })} />
                </ModalHeader>
                <Modal.Body>
                  {this.state.userImages.map(image => (
                    <div className="image-div">
                      <img className="image" src={image.imageSrc} alt={image.user} onClick={this.setLargeImage(image.fileName)} />
                      <br/>
                    </div>
                  ))}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary">Add Friend</Button>
                  <Button variant="secondary" onClick={() => this.setState({ viewUser: false })}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div>
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
