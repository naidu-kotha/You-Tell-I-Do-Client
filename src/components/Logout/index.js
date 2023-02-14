import {withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Logout = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('master_jwt_token')
    Cookies.remove('student_jwt_token')
    history.replace('/login')
  }
  return (
    <button
      type="button"
      className="logout-desktop-btn"
      onClick={onClickLogout}
    >
      Logout
    </button>
  )
}

export default withRouter(Logout)
