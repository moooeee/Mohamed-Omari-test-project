import {Component} from "react"
import {Link} from "react-router-dom"
import styles from "./styles/productCard.module.scss"
import {motion, AnimatePresence} from "framer-motion"
import {ReactComponent as CartLogo} from "../images/cartLogo.svg"
import {Context} from "../context/context"
import Media from "react-media"

class ProductCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHovered: false,
      productAttrs: {},
    }

    this.setAttribute = this.setAttribute.bind(this)
  }

  componentDidMount() {
    let productAttrs = {}

    const {product} = this.props

    product.attributes.forEach((attr) => {
      if (attr.type === "swatch") {
        productAttrs[attr.name] = attr.items[0].value
      } else if (attr.type === "text") {
        productAttrs[attr.name] = attr.items[0].value
      }
    })

    this.setState({productAttrs})
  }

  static getDerivedStateFromProps(props) {
    let productAttrs = {}

    const {product} = props

    product.attributes.forEach((attr) => {
      if (attr.type === "swatch") {
        productAttrs[attr.name] = attr.items[0].value
      } else if (attr.type === "text") {
        productAttrs[attr.name] = attr.items[0].value
      }
    })

    return {productAttrs}
  }

  setAttribute(name, value) {
    const {productAttrs} = this.state
    this.setState({
      productAttrs: {
        ...productAttrs,
        [name]: value,
      },
    })
  }

  static contextType = Context

  render() {
    const {isHovered, productAttrs} = this.state
    const {product} = this.props
    const {currency, addToCart, setShowCartOverlay} = this.context

    const cur = product.prices.filter((price) => {
      return price.currency.label === currency.label
    })[0]

    let swatchAttrs = [],
      textAttrs = []
    product.attributes.forEach((attr) => {
      if (attr.type === "swatch") {
        swatchAttrs.push(attr)
      } else if (attr.type === "text") {
        textAttrs.push(attr)
      }
    })

    return (
      <motion.div
        className={`${styles.card} ${!product.inStock && styles.outOfStock}`}
        onPointerEnter={() => {
          this.setState({isHovered: true})
        }}
        onPointerLeave={() => {
          this.setState({isHovered: false})
        }}
        onFocus={() => {
          this.setState({isHovered: true})
        }}
        onBlur={() => {
          this.setState({isHovered: false})
        }}
        layout
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{ease: "easeInOut"}}
      >
        <Link
          className={styles.anchor}
          to={`/products/${product.id}`}
          tabIndex={!product.inStock ? -1 : 0}
        />
        <div className={styles.cardBody}>
          <figure>
            <div className={styles.productImageWrapper}>
              <img
                src={product.gallery[0]}
                alt={product.name}
                style={{opacity: product.inStock ? 1 : 0.4}}
                loading="lazy"
              />
              {!product.inStock && (
                <div className={styles.outOfStockLabel}>OUT OF STOCK</div>
              )}
              <div className={styles.addToCart}>
                <Media query="(hover: none)">
                  {(match) => {
                    const showBtn = !product.inStock
                      ? false
                      : match
                      ? true
                      : isHovered
                      ? true
                      : false

                    return (
                      <AnimatePresence>
                        {showBtn && (
                          <motion.button
                            key={product.id}
                            className={styles.btn}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 10}}
                            transition={{
                              ease: "easeInOut",
                            }}
                            onClick={() => {
                              addToCart({
                                product: {...product},
                                selectedAttrs: {...productAttrs},
                                amount: 1,
                              })
                              window.scrollTo({
                                top: 0,
                                left: 0,
                              })
                              setShowCartOverlay(true)
                            }}
                            aria-label="Add to Cart"
                          >
                            <CartLogo />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    )
                  }}
                </Media>
              </div>
            </div>
            <div
              className={styles.productInfo}
              style={{opacity: product.inStock ? 1 : 0.4}}
            >
              {true && (
                <div className={styles.productInfoBody}>
                  <div className={styles.title}>{product.name}</div>
                  <div className={styles.price}>
                    {cur.currency.symbol} {cur.amount}
                  </div>
                </div>
              )}
            </div>
          </figure>
        </div>
      </motion.div>
    )
  }
}

export default ProductCard
