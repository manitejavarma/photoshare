import React, { Component } from 'react'
import { connect } from 'react-redux'
import cognitoUtils from '../lib/cognitoUtils'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { Alert, Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import './Home.css'
import { Button } from 'react-bootstrap'

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
      friends: [],
      isFriend: false,
      buttonText: "Add Friend"
    }
  }

  componentDidMount() {
    if (this.props.session.isLoggedIn) {
        this.getUserImages(this.props.location.query['username'])
        this.checkFriend(this.props.session.user.sub);
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
    // this.setState({ isOpen: true, largeImageSrc: e.target.currentSrc })
  }

  checkFriend(sub) {
    const username = this.props.location.query['username'];
    if (username === this.props.session.user.userName) {
      this.setState({ isFriend: true, buttonText: "Your Page"})
    } else {
      axios.get('/getFriends', {
        params: {
          sub : sub,
          token: this.props.session.credentials.idToken
        }
      }).then((response) => {
        let jsonResponse = response.data.friends
        for (let i = 0; i < jsonResponse.length; i++) {
          if ( username === jsonResponse[i]) {
            this.setState({ isFriend: true, buttonText: "Friended"})
          }
        }
      })
    }
  }

  addFriend(sub) {
    axios.post('/addFriend', {
      params: {
        sub : sub,
        friend: this.props.location.query['username'],
        token: this.props.session.credentials.idToken  
      }
    }).then((response) => {
      if (response.status === 200) {
        this.setState({ isFriend: true, buttonText: "Friended"})
      } else {
        console.log(response)
      }
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
            imageSrc: jsonResponse[i].data
          }
          img.push(temp_img)
        }
        this.setState({ images: img})
      }
    })
  }

  render() {
    if(this.props.location == undefined || this.props.location == null || this.props.location == '') {
        <Redirect to='/'/>
    }
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
            <h1 id="hello_user">{this.props.location.query['username']}'s Profile</h1>
            <div class="text-center">
              <Button variant="primary" class="text-center" disabled={this.state.isFriend} onClick={() => this.addFriend(this.props.session.user.sub)}>{this.state.buttonText}</Button>
            </div>
            <br/>
            <br/>
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
