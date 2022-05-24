import {Component} from "react"
import {createPortal} from "react-dom"

class Portal extends Component {
  render() {
    const {children, styles} = this.props
    return createPortal(
      <div style={{...styles}}>{children}</div>,
      document.body
    )
  }
}

export default Portal
