/* eslint-disable no-alert */
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiOutlineAlignLeft} from 'react-icons/ai'

import Logout from '../Logout'
import './index.css'

class Student extends Component {
  state = {
    activityLogClicked: false,
    questionsArray: [],
    answersArray: [],
    username: '',
    answersSubmitted: false,
  }

  componentDidMount() {
    this.getQuestions()
  }

  getQuestions = () => {
    const stringifiesQuestionsArray = localStorage.getItem('questionsList')
    const questionsArray = JSON.parse(stringifiesQuestionsArray)
    this.setState({questionsArray})
  }

  onEnterAnswer = event => {
    const {questionsArray, answersArray} = this.state
    const id = event.currentTarget.getAttribute('data-value')
    const answerObj = questionsArray.filter(each => each.id === id)
    const answerObject = answerObj[0]
    answerObject.givenAnswer = parseInt(event.target.value)
    // console.log(answerObject)
    const answerIndex = answersArray.findIndex(each => each.id === id)
    if (answerIndex === -1) {
      this.setState(prevState => ({
        answersArray: [...prevState.answersArray, answerObject],
      }))
    } else {
      answersArray[answerIndex] = answerObject
      this.setState({answersArray})
    }
  }

  submitAnswers = event => {
    event.preventDefault()
    const {username, answersArray} = this.state
    if (username === '') {
      alert('Please Enter Your Name')
    } else {
      const nameKey = `${username}'s Answer`
      //   const ans = {[nameKey]: answersArray}
      const answers = localStorage.getItem('answersList')
      if (answers === null) {
        const ans = {[nameKey]: answersArray}
        localStorage.setItem('answersList', JSON.stringify(ans))
      } else {
        const a = JSON.parse(answers)
        a[nameKey] = answersArray
        //   console.log(a)
        localStorage.setItem('answersList', JSON.stringify(a))
      }
      this.setState({answersSubmitted: true})
    }
  }

  activityLog = () => {
    const {questionsArray, answersArray} = this.state
    return (
      <form className="activity-container" onSubmit={this.submitAnswers}>
        <ol className="student-question-container">
          {questionsArray.map(each => (
            <li key={each.id}>
              <h1 className="question">{each.question}</h1>
              <input
                type="number"
                placeholder="Type your answer in digits"
                className="answer-input"
                onBlur={this.onEnterAnswer}
                data-value={each.id}
              />
            </li>
          ))}
        </ol>
        {answersArray.length > 0 && (
          <button type="submit" className="submit-answers-button">
            Submit Answers
          </button>
        )}
      </form>
    )
  }

  toggleActivityLog = () => {
    this.setState(prevState => ({
      activityLogClicked: !prevState.activityLogClicked,
    }))
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  render() {
    const {activityLogClicked, answersSubmitted} = this.state
    const studentJwtToken = Cookies.get('student_jwt_token')
    if (studentJwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="student-container">
        <Logout />
        <button
          type="button"
          className="activities-btn"
          onClick={this.toggleActivityLog}
        >
          Activity Log
          <span>
            <AiOutlineAlignLeft className="activity-log" />
          </span>
        </button>

        <div className="student-sub-container">
          <div className="welcome-container">
            <h1 className="student-heading">Welcome</h1>
            <div>
              <label htmlFor="name" className="name-label-text">
                Name:
              </label>
              <input
                type="text"
                className="name-input"
                id="name"
                placeholder="Enter your name here"
                onChange={this.onChangeUsername}
              />
            </div>
            {answersSubmitted ? (
              <>
                <p className="test-details">**** Answers Submitted ****</p>
                <p className="test-details">
                  You can resubmit your answers by changing your response and
                  clicking Submit Answers button.
                </p>
              </>
            ) : (
              <p className="test-details">Check Activity Log to begin test</p>
            )}
          </div>
          {activityLogClicked && this.activityLog()}
        </div>
      </div>
    )
  }
}

export default Student
