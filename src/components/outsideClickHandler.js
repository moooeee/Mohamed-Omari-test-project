import {Component} from "react"

class OutSideClickHandler extends Component {
  constructor(props) {
    super(props)
    this.detectClickOutSide = this.detectClickOutSide.bind(this)
  }

  detectClickOutSide(e) {
    const {target, cb} = this.props
    if (target.current && !target.current.contains(e.target)) {
      cb()
    }
  }

  componentDidMount() {
    setTimeout(() => {
      window.addEventListener("click", this.detectClickOutSide)
    }, 0)
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.detectClickOutside)
  }

  render() {
    return this.props.children
  }
}

export default OutSideClickHandler
