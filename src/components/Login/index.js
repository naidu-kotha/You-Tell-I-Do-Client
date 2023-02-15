/* eslint-disable no-alert */
import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
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

class Login extends Component {
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

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password, category} = this.state
    const {history} = this.props
    if (!username || !password) {
      alert('Please Fill all Inputs')
    } else {
      const userDetails = {username, password, category}
      try {
        const response = await axios.post('/api/login/', {userDetails})
        const {data} = response
        // console.log(response)
        // console.log(data)
        if (data.result) {
          const jwtToken = data.jwt_token
          console.log(jwtToken)
          //   console.log(history)
          if (category === 'MASTER') {
            Cookies.set('master_jwt_token', jwtToken, {expires: 1, path: '/'})
            history.replace('/master')
          } else {
            Cookies.set('student_jwt_token', jwtToken, {expires: 1, path: '/'})
            history.replace('/student')
          }
        }
      } catch (e) {
        console.log(e)
        if (e.response.status === 404) {
          alert(e.message, e.name)
        } else {
          alert(e.response.data)
        }
      }
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
            src="https://media.licdn.com/dms/image/C510BAQFEpFHWZMVDRA/company-logo_200_200/0/1519893946434?e=2147483647&v=beta&t=nlkQL8i_V1Ke4BdGUjDndBsRSmzTmPCZ0-N7VKfH6lE"
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
            Log in
          </button>
          <p className="chng-txt">
            Already a member?{' '}
            <span>
              <button className="change-btn" type="button">
                <Link className="link" to="/signup">
                  Sign Up
                </Link>
              </button>
            </span>
          </p>
        </form>
      </div>
    )
  }
}

export default Login
