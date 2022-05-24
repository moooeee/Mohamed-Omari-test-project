import {Component} from "react"

class VisuallyHidden extends Component {
  render() {
    const {style, ...props} = this.props

    return (
      <span
        style={{
          border: 0,
          clip: "rect(0 0 0 0)",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: "1px",
          whiteSpace: "nowrap",
          wordWrap: "normal",
          ...style,
        }}
        {...props}
      />
    )
  }
}

export default VisuallyHidden
