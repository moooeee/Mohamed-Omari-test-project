import {Component} from "react"
import {Context} from "../context/context"
import styles from "./styles/cartOverlayListItem.module.scss"
import {ReactComponent as PlusIcon} from "../images/plus.svg"
import {ReactComponent as MinusIcon} from "../images/minus.svg"
import VisuallyHidden from "./visuallyHidden"

class CartOverlayListItem extends Component {
  static contextType = Context

  componentWillUnmount() {
    document.body.style.overflow = "auto"
    this.context.clearLastInsertedItem()
  }

  render() {
    const {product} = this.props
    const {currency, updateCart, incrementAmount, decrementAmount} =
      this.context

    const cur = product.productInfo.product.prices.find((price) => {
      return price.currency.label === currency.label
    })
    let swatchAttrs = [],
      textAttrs = []
    product.productInfo.product.attributes.forEach((attr) => {
      if (attr.type === "swatch") {
        swatchAttrs.push(attr)
      } else if (attr.type === "text") {
        textAttrs.push(attr)
      }
    })
    const productAttrs = product.productInfo.selectedAttrs

    return (
      <li
        ref={this.cartItemRef}
        data-item-id={product.id}
        className={styles.cartItem}
        tabIndex={-1}
      >
        <div className={styles.cartItemBody}>
          <div className={styles.productInfo}>
            <h2 className={styles.productName}>
              {product.productInfo.product.name}
            </h2>
            <div className={styles.productPrice}>
              <div>
                {cur.currency.symbol} {cur.amount}
              </div>
            </div>
            <div className={styles.productAttrs}>
              {swatchAttrs.length > 0 ? (
                <div className={styles.swatchAttrs}>
                  {swatchAttrs.map((attr) => {
                    return (
                      <div key={attr.name} className={styles.swatchAttr}>
                        <div className={styles.attrName}>{attr.name}:</div>
                        <div className={styles.attrValues}>
                          {attr.items.map((item, i) => {
                            return (
                              <button
                                key={item.value}
                                className={styles.attrValue}
                                style={{
                                  backgroundColor: item.value,
                                  border:
                                    item.value === "#FFFFFF"
                                      ? "1px solid var(--black)"
                                      : "none",
                                }}
                                data-selected={
                                  productAttrs[attr.name] === item.value
                                }
                                onClick={() => {
                                  updateCart(product.id, attr.name, item.value)
                                }}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : null}
              {textAttrs.length > 0 ? (
                <div className={styles.textAttrs}>
                  {textAttrs.map((attr) => {
                    return (
                      <div key={attr.name} className={styles.textAttr}>
                        <div className={styles.attrName}>{attr.name}:</div>
                        <div className={styles.attrValues}>
                          {attr.items.map((item) => {
                            return (
                              <button
                                key={item.value}
                                data-selected={
                                  productAttrs[attr.name] === item.value
                                }
                                className={styles.attrValue}
                                onClick={() => {
                                  updateCart(product.id, attr.name, item.value)
                                }}
                              >
                                {item.value}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
          <div className={styles.productQuantity}>
            <button
              onClick={() => {
                incrementAmount(product.id)
              }}
              aria-label={`add another ${product.productInfo.product.name} to cart`}
            >
              <PlusIcon />
            </button>
            <div>{product.productInfo.amount}</div>
            <VisuallyHidden aria-live="polite">
              total {product.productInfo.product.name} items in cart is{" "}
              {product.productInfo.amount}
            </VisuallyHidden>
            <button
              onClick={() => {
                decrementAmount(product.id)
              }}
              aria-label={
                product.productInfo.amount === 1
                  ? `remove ${product.productInfo.product.name} from cart`
                  : `decrement the number of ${product.productInfo.product.name} in cart`
              }
            >
              <MinusIcon />
            </button>
          </div>
          <div className={styles.productImage}>
            <img
              src={product.productInfo.product.gallery[0]}
              alt={`${product.productInfo.product.name}`}
            />
          </div>
        </div>
      </li>
    )
  }
}

export default CartOverlayListItem
