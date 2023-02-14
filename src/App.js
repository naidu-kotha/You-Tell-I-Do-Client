import {Route, Switch, Redirect} from 'react-router-dom'
import Home from './components/Home'
import SignUp from './components/SignUp'
import Master from './components/Master'
import Student from './components/Student'
import Login from './components/Login'
import NotFound from './components/NotFound'

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/student" component={Student} />
    <Route exact path="/master" component={Master} />
    <Route exact path="/signup" component={SignUp} />
    <Route exact path="/login" component={Login} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
