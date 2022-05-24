import {Component} from "react"
import styles from "./styles/productImagesSlider.module.scss"

class ProductImagesSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedImageIndex: 0,
    }
  }

  render() {
    const {urls, productName} = this.props
    const {selectedImageIndex} = this.state

    return (
      <div className={styles.container}>
        {urls?.length > 1 ? (
          <div className={styles.thumbs}>
            {urls.map((imgSrc, i) => {
              return (
                <button
                  key={i}
                  className={styles.imageWrapper}
                  onClick={() => {
                    this.setState({selectedImageIndex: i})
                  }}
                >
                  <img src={imgSrc} alt={productName} />
                </button>
              )
            })}
          </div>
        ) : null}
        <div className={styles.mainImage}>
          <img src={urls?.[selectedImageIndex]} alt={productName} />
        </div>
      </div>
    )
  }
}

export default ProductImagesSlider
