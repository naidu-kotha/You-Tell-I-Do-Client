import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Home = () => {
  const studentJwtToken = Cookies.get('student_jwt_token')
  const masterJwtToken = Cookies.get('master_jwt_token')
  if (studentJwtToken !== undefined) {
    return <Redirect to="/student" />
  }
  if (masterJwtToken !== undefined) {
    return <Redirect to="/master" />
  }
  return (
    <div className="home-container">
      <h1 className="home-heading">Welcome</h1>
      <p className="redirection">
        If your are a new user, procced to{' '}
        <span>
          <Link className="redirection-link" to="/signup">
            Sign Up
          </Link>
        </span>
      </p>
      <p className="redirection">
        If your are an existing user, procced to{' '}
        <span>
          <Link className="redirection-link" to="/login">
            Login
          </Link>
        </span>
      </p>
    </div>
  )
}

export default Home
