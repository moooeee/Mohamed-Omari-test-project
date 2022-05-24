import {Component} from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  static getDerivedStateFromError(e) {
    this.setState({error: e})
  }

  render() {
    if (this.state.error) {
      return <div>Something went wrong! try refreshing the page!</div>
    }

    return this.props.children
  }
}

export default ErrorBoundary
