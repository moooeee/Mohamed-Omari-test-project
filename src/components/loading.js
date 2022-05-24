import {Component} from "react"

class Loading extends Component {
  render() {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        loading...
      </div>
    )
  }
}

export default Loading
