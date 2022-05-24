import {Component, createRef} from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

// created this component trying to solve the layout shift problem when loading images
// basically trying to implement a nextjs-Image like component, but didn't figure it out :(

class Image extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageState: "loading",
    }
    this.image = createRef()
  }

  componentDidMount() {
    this.image.current.onload = () => {
      this.setState({imageState: "loaded"})
    }

    this.image.current.onerror = (e) => {
      this.setState({imageState: "error"})
    }
  }

  render() {
    const {src, loadingFallback, errorFallback, alt, width, height, ...props} =
      this.props
    const image = this.image
    const {imageState} = this.state

    return (
      <div style={{position: "relative", width: "100%", height: "100%"}}>
        {imageState === "error" ? (
          <Skeleton
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              zIndex: 5,
            }}
          />
        ) : null}
        {imageState === "loading" ? (
          <Skeleton
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              zIndex: 5,
            }}
          />
        ) : null}
        <img
          ref={image}
          src={src}
          alt="boo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          {...props}
        />
      </div>
    )
  }
}

export default Image
