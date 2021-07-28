import React, { Component } from 'react'
import { connect } from 'react-redux'
import cognitoUtils from '../lib/cognitoUtils'
import UserService from "./services/user-service"
import axios from 'axios'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { Alert, Navbar, Container, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import './Home.css'
import { FaUserCircle } from 'react-icons/fa';

const mapStateToProps = state => {
  return { session: state.session }
}

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      isOpen: false,
      largeImageSrc: ''
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
              <Nav.Link>Friends</Nav.Link>
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
                  <div className="name"><FaUserCircle /> <a className="name-link" href="url">{image.user}</a></div>
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
