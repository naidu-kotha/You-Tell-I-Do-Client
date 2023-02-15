import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {v4 as uuid} from 'uuid'
import Cookies from 'js-cookie'
import Logout from '../Logout'
import './index.css'

const numberWords = [
  {id: 0, value: 0, word: 'zero'},
  {id: 1, value: 1, word: 'one'},
  {id: 2, value: 2, word: 'two'},
  {id: 3, value: 3, word: 'three'},
  {id: 4, value: 4, word: 'four'},
  {id: 5, value: 5, word: 'five'},
  {id: 6, value: 6, word: 'six'},
  {id: 7, value: 7, word: 'seven'},
  {id: 8, value: 8, word: 'eight'},
  {id: 9, value: 9, word: 'nine'},
]

const operators = [
  {id: 0, operator: '+', text: 'plus'},
  {id: 1, operator: '-', text: 'minus'},
  {id: 2, operator: '*', text: 'times'},
  {id: 3, operator: '/', text: 'divided_by'},
]

class Master extends Component {
  state = {
    firstNum: numberWords[0].word,
    sym: operators[0].text,
    secondNum: numberWords[0].word,
    questionsArray: [],
    answersArray: [],
    questionsSubmitted: false,
  }

  componentDidMount() {
    this.getAnswers()
  }

  getAnswers = () => {
    const answersList = localStorage.getItem('answersList')
    // console.log(answersList)
    if (answersList !== null) {
      const answersArray = []
      answersArray.push(JSON.parse(answersList))
      // console.log(answersArray)
      this.setState({answersArray: answersArray[0]})
    }
  }

  displayAnswers = () => {
    const {answersArray} = this.state
    // console.log(answersArray)
    const ans = []
    const array = Object.entries(answersArray)
    ans.push(array)
    // console.log(array)

    return (
      <div className="display-answers-container">
        {array.map(each => (
          <ul className="answers-container">
            <li className="answered-by">{each[0]}</li>
            <div className="answer-container-style">
              {each[1].map(a => (
                <div key={a.id}>
                  <li className="answer-list-item">
                    <b>{a.question}</b>
                  </li>
                  <li className="answer-list-item">Answer = {a.answer}</li>
                  <li className="answer-list-item">
                    Given Answer = {a.givenAnswer}
                  </li>
                  <br />
                </div>
              ))}
            </div>
          </ul>
        ))}
      </div>
    )
  }

  onChange = event => {
    const {name, value} = event.target
    this.setState({
      [name]: value,
    })
  }

  calculateResult = (a, op, b) => {
    switch (op) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '*':
        return a * b
      case '/':
        return parseInt(a / b)
      default:
        return null
    }
  }

  submitQuestion = event => {
    event.preventDefault()
    const {firstNum, sym, secondNum} = this.state
    const question = `${firstNum}(${sym}(${secondNum}()))`
    const num1Obj = numberWords.find(num => num.word === firstNum)
    const operatorObj = operators.find(operator => operator.text === sym)
    const num2Obj = numberWords.find(num => num.word === secondNum)
    const num1 = num1Obj.value
    const op = operatorObj.operator
    const num2 = num2Obj.value
    // console.log(num1Obj.value)
    // console.log(operatorObj.operator)
    // console.log(num2Obj.value)
    // console.log(question)
    const result = this.calculateResult(num1, op, num2)
    // console.log(result)
    const mathQuestion = {
      id: uuid(),
      question,
      answer: result,
    }
    // console.log(mathQuestion)
    this.setState(prevState => ({
      questionsArray: [...prevState.questionsArray, mathQuestion],
    }))
  }

  onDelete = event => {
    const id = event.currentTarget.getAttribute('data-value')
    const {questionsArray} = this.state
    const filteredQuestionsArray = questionsArray.filter(each => each.id !== id)
    this.setState({questionsArray: filteredQuestionsArray})
  }

  createTest = event => {
    event.preventDefault()
    // console.log('test')
    const {questionsArray} = this.state
    localStorage.setItem('questionsList', JSON.stringify(questionsArray))
  }

  clearQuestionsArray = () => {
    this.setState({questionsArray: []})
    localStorage.removeItem('questionsList')
  }

  clearAnswersArray = () => {
    this.setState({answersArray: []})
    localStorage.removeItem('answersList')
  }

  displayTestCreatedMsg = () => {
    this.setState({questionsSubmitted: true})
  }

  render() {
    const {questionsArray, answersArray, questionsSubmitted} = this.state
    const masterJwtToken = Cookies.get('master_jwt_token')
    if (masterJwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="master-container">
        <Logout />
        <h1 className="master-heading">Prepare your questions</h1>
        <div className="form-list-container">
          <form className="form-container" onSubmit={this.submitQuestion}>
            <div className="question-container">
              <select
                className="number-container"
                name="firstNum"
                onChange={this.onChange}
              >
                {numberWords.map(each => (
                  <option key={each.id} value={each.word}>
                    {each.value}
                  </option>
                ))}
              </select>
              <select
                className="operator-container"
                name="sym"
                onChange={this.onChange}
              >
                {operators.map(each => (
                  <option key={each.id} value={each.text}>
                    {each.operator}
                  </option>
                ))}
              </select>
              <select
                className="number-container"
                name="secondNum"
                onChange={this.onChange}
              >
                {numberWords.map(each => (
                  <option key={each.id} value={each.word}>
                    {each.value}
                  </option>
                ))}
              </select>
            </div>
            <div className="btn-container">
              <button type="submit" className="create-button">
                Create Question
              </button>
              <div>
                <button
                  type="button"
                  className="submit-question-button"
                  onClick={this.clearQuestionsArray}
                >
                  Clear All Questions
                </button>
                <button
                  type="button"
                  className="submit-question-button"
                  onClick={this.clearAnswersArray}
                >
                  Clear Received Answers
                </button>
              </div>
            </div>
            {questionsSubmitted && <p className="test">Test Created.</p>}
          </form>
          {questionsArray.length > 0 && (
            <form
              className="question-form-container"
              onSubmit={this.createTest}
            >
              <ol className="question-list">
                {questionsArray.map(each => (
                  <li key={each.id} className="list">
                    <div className="list-item">
                      <h1 className="question">{each.question}</h1>
                      <button
                        type="button"
                        onClick={this.onDelete}
                        data-value={each.id}
                        className="remove-btn"
                      >
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/delete-img.png"
                          alt="delete"
                          className="delete-icon"
                        />
                      </button>
                    </div>
                  </li>
                ))}
                {questionsArray.length > 0 && (
                  <button
                    type="submit"
                    className="submit-test-button"
                    onClick={this.displayTestCreatedMsg}
                  >
                    Submit Questions
                  </button>
                )}
              </ol>
            </form>
          )}
        </div>
        {answersArray && this.displayAnswers()}
      </div>
    )
  }
}

export default Master
