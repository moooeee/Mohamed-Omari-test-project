import {Component} from "react"
import styles from "./styles/cart.module.scss"
import {Context} from "../context/context"
import {ReactComponent as PlusIcon} from "../images/plus.svg"
import {ReactComponent as MinusIcon} from "../images/minus.svg"
import Media from "react-media"
import ProductGallery from "../components/productGallery"
import VisuallyHidden from "../components/visuallyHidden"

const TAX = 21

class CartProductItem extends Component {
  static contextType = Context

  render() {
    const {product} = this.props
    const {currency, updateCart, incrementAmount, decrementAmount} =
      this.context
    const priceInfo = product.productInfo.product.prices.find(
      (price) => price.currency.label === currency.label
    )
    let swatchAttrs = [],
      textAttrs = []
    product.productInfo.product.attributes?.forEach((attr) => {
      if (attr.type === "swatch") {
        swatchAttrs.push(attr)
      } else if (attr.type === "text") {
        textAttrs.push(attr)
      }
    })

    return (
      <li className={styles.cartProductItem}>
        <div className={styles.productItemBody}>
          <div className={styles.productInfo}>
            <h2 className={styles.productBrand}>
              {product.productInfo.product.brand}
            </h2>
            <h2 className={styles.productName}>
              {product.productInfo.product.name}
            </h2>
            <h2 className={styles.productPrice}>
              {priceInfo.currency.symbol}
              {priceInfo.amount}
            </h2>
            <div className={styles.productAttrs}>
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
                                product.productInfo.selectedAttrs[attr.name] ===
                                item.value
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
              <div className={styles.textAttrs}>
                {textAttrs.map((attr) => {
                  return (
                    <div key={attr.name} className={styles.textAttr}>
                      <div className={styles.attrName}>{attr.name}:</div>
                      <div className={styles.attrValues}>
                        {attr.items.map((item, i) => {
                          return (
                            <button
                              key={item.value}
                              data-selected={
                                product.productInfo.selectedAttrs[attr.name] ===
                                item.value
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
            </div>
            <Media query="(max-width: 770px)">
              {(match) => {
                return (
                  match && (
                    <div className={styles.productQuantity}>
                      <button
                        onClick={() => {
                          incrementAmount(product.id)
                        }}
                      >
                        <PlusIcon />
                      </button>
                      <div className={styles.productAmount}>
                        {product.productInfo.amount}
                      </div>
                      <button
                        onClick={() => {
                          decrementAmount(product.id)
                        }}
                      >
                        <MinusIcon />
                      </button>
                    </div>
                  )
                )
              }}
            </Media>
          </div>
          <Media query="(max-width: 770px)">
            {(match) => {
              if (!match) {
                return (
                  <div className={styles.productQuantity}>
                    <button
                      onClick={() => {
                        incrementAmount(product.id)
                      }}
                      aria-label={`add another ${product.productInfo.product.name} to cart`}
                    >
                      <PlusIcon />
                    </button>
                    <div className={styles.productAmount}>
                      {product.productInfo.amount}
                    </div>
                    <VisuallyHidden aria-live="polite" aria-atomic="true">
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
                )
              }
            }}
          </Media>
          <div className={styles.productGallery}>
            <ProductGallery
              imgUrls={product.productInfo.product.gallery}
              productName={product.productInfo.product.name}
            />
          </div>
        </div>
      </li>
    )
  }
}

class Cart extends Component {
  static contextType = Context

  render() {
    const {
      cart: {products},
      currency,
    } = this.context

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
    const tax = Number(((totalPrice * 21) / 100).toFixed(2))

    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Cart</h2>
        <main className={styles.cartBody}>
          {products.length > 0 ? (
            <>
              <ul className={styles.productsList}>
                {products.map((product) => {
                  return <CartProductItem key={product.id} product={product} />
                })}
              </ul>
              <div className={styles.totalPrice}>
                <div className={styles.tax}>
                  Tax {TAX}%:{" "}
                  <strong>
                    {currency.symbol}
                    {tax}
                  </strong>
                </div>
                <div className={styles.quantity}>
                  Quantity: <strong>{products.length}</strong>
                </div>
                <div className={styles.total}>
                  Total:{" "}
                  <strong>
                    {currency.symbol}
                    {totalPrice}
                  </strong>
                </div>
                <VisuallyHidden aria-live="polite">
                  Cart total: {totalPrice} {currency.label}
                </VisuallyHidden>
                <button className={styles.orderBtn}>ORDER</button>
              </div>
            </>
          ) : (
            <div>Your bag is empty!</div>
          )}
        </main>
      </div>
    )
  }
}

export default Cart
