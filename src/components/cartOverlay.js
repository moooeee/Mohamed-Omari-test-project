import {Component, createRef} from "react"
import CartOverlayBody from "./cartOverlayBody"
import {Context} from "../context/context"
import styles from "./styles/cartOverlay.module.scss"
import {ReactComponent as CartLogo} from "../images/cartLogo.svg"
import {AnimatePresence} from "framer-motion"

class CartOverlay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showOverlay: false,
      nodeRect: null,
    }

    this.triggerRef = createRef()
  }

  static contextType = Context

  render() {
    const {showOverlay} = this.state
    const {
      cart: {products},
      showCartOverlay,
      setShowCartOverlay,
    } = this.context

    return (
      <div className={styles.container}>
        <div className={styles.triggerWrapper}>
          <button
            onClick={() => {
              document.body.style.overflow = "hidden"
              this.setState({showOverlay: !showOverlay})
              setShowCartOverlay(!showCartOverlay)
            }}
            className={styles.trigger}
            aria-label="View My Cart"
            ref={this.triggerRef}
          >
            <CartLogo />
          </button>
          {products.length > 0 && (
            <div className={styles.itemsCount} aria-live="assertive">
              <span
                style={{
                  // 6 and 8 has a little space at the bottom of the character in this font
                  marginBottom:
                    products.length === 6 || products.length === 8
                      ? "0px"
                      : "2px",
                }}
                aria-label={`total items in cart is ${products.length}`}
              >
                {products.length}
              </span>
            </div>
          )}
        </div>
        <AnimatePresence>
          {showCartOverlay && <CartOverlayBody triggerRef={this.triggerRef} />}
        </AnimatePresence>
      </div>
    )
  }
}

export default CartOverlay
