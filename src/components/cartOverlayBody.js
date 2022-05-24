import {motion} from "framer-motion"
import {Component, createRef} from "react"
import {Link} from "react-router-dom"
import {Context} from "../context/context"
import CartOverlayListItem from "./cartOverlayListItem"
import OutSideClickHandler from "./outsideClickHandler"
import Portal from "./portal"
import styles from "./styles/cartOverlayBody.module.scss"
import FocusLock from "react-focus-lock"
import VisuallyHidden from "./visuallyHidden"

class CartOverlayBody extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.cartBodyRef = createRef()
    this.dismissOverlay = this.dismissOverlay.bind(this)
  }

  static contextType = Context

  componentDidMount() {
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    window.addEventListener("keydown", this.dismissOverlay)

    const {
      lastInsertedItem,
      cart: {products},
    } = this.context

    let itemIndexInList
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === lastInsertedItem) {
        itemIndexInList = i
        break
      }
    }

    // don't scroll if the item is the first in the list
    if (lastInsertedItem && itemIndexInList !== 0) {
      const el = document.querySelector(`[data-item-id="${lastInsertedItem}"]`)
      const topPos = el.offsetTop - 10
      setTimeout(() => {
        if (this.cartBodyRef.current) {
          this.cartBodyRef.current.scrollTop = topPos
        }
      }, 0)
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"
    console.log("dismiss")
    window.removeEventListener("keydown", this.dismissOverlay)
  }

  dismissOverlay(e) {
    if (e.code === "Escape") {
      this.context.setShowCartOverlay(false)
    }
  }

  render() {
    const {
      cart: {products},
      currency,
      setShowCartOverlay,
    } = this.context
    const {triggerRef} = this.props

    const totalPrice = Number(
      products
        .reduce((comm, product) => {
          return (
            product.productInfo.product.prices.find(
              (price) => price.currency.label === currency.label
            ).amount *
              product.productInfo.amount +
            comm
          )
        }, 0)
        .toFixed(2)
    )

    return (
      <FocusLock>
        <OutSideClickHandler
          target={this.cartBodyRef}
          cb={() => {
            setShowCartOverlay(false)
            document.body.style.overflow = "auto"
            document.documentElement.style.overflow = "auto"
          }}
        >
          <motion.div
            className={styles.cartOverlay}
            initial={{opacity: 0, y: -5}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -5}}
            transition={{ease: "easeInOut"}}
            ref={this.cartBodyRef}
            role="dialog"
            aria-label="your cart list"
            aria-modal={true}
            onUnmount={() => triggerRef.current.focus()}
          >
            <Portal>
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#0005",
                  zIndex: 50,
                  transition: "background-color .3s ease",
                }}
              />
            </Portal>
            <div className={styles.cartOverlayBody}>
              <h2 className={styles.heading}>
                <span>My bag:</span> {products.length}{" "}
                {products.length > 1 ? "items" : "item"}
              </h2>
              {products.length > 0 ? (
                <>
                  <ul className={styles.productsList}>
                    {products.map((product) => {
                      return (
                        <CartOverlayListItem
                          product={product}
                          key={product.id}
                        />
                      )
                    })}
                  </ul>
                  <div className={styles.totalPrice}>
                    <div>Total</div>
                    <div>
                      {currency.symbol}
                      {totalPrice}
                    </div>
                  </div>
                  <VisuallyHidden aria-live="polite">
                    Cart total: {totalPrice} {currency.label}
                  </VisuallyHidden>
                  <div className={styles.checkout}>
                    <Link
                      to="/cart"
                      className={styles.viewBag}
                      onClick={() => {
                        this.setState({showOverlay: false})
                        setShowCartOverlay(false)
                      }}
                    >
                      VIEW BAG
                    </Link>
                    <Link
                      to="/cart"
                      className={styles.checkout}
                      onClick={() => {
                        this.setState({showOverlay: false})
                        setShowCartOverlay(false)
                      }}
                    >
                      CHECKOUT
                    </Link>
                  </div>
                </>
              ) : (
                <div className={styles.emptyCart}>nothing to show here</div>
              )}
            </div>
          </motion.div>
        </OutSideClickHandler>
      </FocusLock>
    )
  }
}

export default CartOverlayBody
