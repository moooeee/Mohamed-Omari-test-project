import {Component} from "react"
import {ReactComponent as CaretRight} from "../images/caretRight.svg"
import {ReactComponent as CaretLeft} from "../images/caretLeft.svg"
import styles from "./styles/productGallery.module.scss"

class ProductGallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedImgIndex: 0,
    }
  }

  render() {
    const {imgUrls, productName} = this.props
    const {selectedImgIndex} = this.state
    const selectedImageUrl = imgUrls[selectedImgIndex]

    return (
      <div className={styles.gallery}>
        <div className={styles.selectedImage}>
          <img src={selectedImageUrl} alt={productName} />
          {imgUrls.length > 1 ? (
            <div className={styles.controlBtns}>
              <button
                onClick={() => {
                  const nextIndex =
                    this.state.selectedImgIndex + 1 >= imgUrls.length
                      ? 0
                      : this.state.selectedImgIndex + 1
                  this.setState({selectedImgIndex: nextIndex})
                }}
              >
                <CaretLeft />
              </button>
              <button
                onClick={() => {
                  const nextIndex =
                    this.state.selectedImgIndex - 1 < 0
                      ? imgUrls.length - 1
                      : this.state.selectedImgIndex - 1
                  this.setState({selectedImgIndex: nextIndex})
                }}
              >
                <CaretRight />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

export default ProductGallery
