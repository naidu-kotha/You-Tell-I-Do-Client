/* eslint-disable no-alert */
import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import './index.css'

const accountOptions = [
  {
    id: 0,
    value: 'MASTER',
    displayText: 'Master',
  },
  {
    id: 1,
    value: 'STUDENT',
    displayText: 'Student',
  },
]

class SignUp extends Component {
  state = {username: '', password: '', category: accountOptions[0].value}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeCategory = async event => {
    this.setState({category: event.target.value})
  }

  onSubmitForm = event => {
    event.preventDefault()
    const {username, password, category} = this.state
    const {history} = this.props
    if (!username || !password) {
      alert('Please Fill all Inputs')
    } else {
      const userDetails = {username, password, category}
      axios.post('/api/signup/', {userDetails}).then(response => {
        // console.log(response)
        if (response.data.lastID) {
          alert('User Successfully Created. Proceed to Login')
          history.replace('/login')
        } else if (response.data.code === 'SQLITE_CONSTRAINT') {
          alert('User already exits. Please try a different username')
        } else {
          alert(response.data.code)
        }
      })
      this.setState({
        username: '',
        password: '',
        category: accountOptions[0].value,
      })
    }
  }

  render() {
    const {username, password} = this.state
    const studentJwtToken = Cookies.get('student_jwt_token')
    const masterJwtToken = Cookies.get('master_jwt_token')
    if (studentJwtToken !== undefined) {
      return <Redirect to="/student" />
    }
    if (masterJwtToken !== undefined) {
      return <Redirect to="/master" />
    }
    return (
      <div className="login-bg">
        <form className="login-form" onSubmit={this.onSubmitForm}>
          <img
            src="https://res.cloudinary.com/dck3ikgrn/image/upload/v1676527078/Free_Sample_By_Wix_gvsse2.png"
            alt="website logo"
            className="login-logo"
          />
          <div className="login-container">
            <label htmlFor="userId" className="label-text">
              USERNAME
            </label>
            <input
              id="userId"
              type="text"
              placeholder="Username"
              className="input-bar"
              value={username}
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="login-container">
            <label htmlFor="pwd" className="label-text">
              PASSWORD
            </label>
            <input
              id="pwd"
              type="password"
              placeholder="Password"
              className="input-bar"
              value={password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="login-container">
            <label className="label-text" htmlFor="categoryType">
              Category
            </label>
            <select
              onChange={this.onChangeCategory}
              className="input-bar"
              id="categoryType"
            >
              {accountOptions.map(each => (
                <option key={each.id} value={each.value}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="login-btn">
            Sign Up
          </button>
          <p className="chng-txt">
            Already a member?{' '}
            <span>
              <button className="change-btn" type="button">
                <Link className="link" to="/login">
                  Login
                </Link>
              </button>
            </span>
          </p>
        </form>
      </div>
    )
  }
}

export default SignUp
