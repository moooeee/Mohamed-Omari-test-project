import {Component} from "react"
import {cancelRequest, getProduct} from "../api/getData"
import styles from "./styles/product.module.scss"
import {Context} from "../context/context"
import ProductImagesSlider from "../components/productImagesSlider"

const getProductIdFromPathname = (path) =>
  path.substring(path.lastIndexOf("/") + 1)

class Product extends Component {
  constructor(props) {
    super(props)
    this.state = {
      product: {},
      productAttrs: {},
      amount: 1,
      isButtonHovered: false,
      selectedImageIndex: 0,
      loading: null,
      error: null,
    }
    this.setAttribute = this.setAttribute.bind(this)
    this.getProduct = this.getProduct.bind(this)
  }

  static contextType = Context

  async getProduct() {
    // to simulate fake loading state
    // let _result = await new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(getData(category.toLowerCase()))
    //   }, 2000)
    // })
    // result = await _result
    //////////////////////////////////////
    // to simulate fake error state
    // let _result = await new Promise((_, reject) => {
    //   setTimeout(() => {
    //     reject(new Error("Errr"))
    //   }, 2000)
    // })
    // result = await _result
    //////////////////////////////////////
    // oscillating between rejecting and resolving
    // let _result = await new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     if (Math.random() > 0.5) {
    //       reject(new Error("hello"))
    //     } else {
    //       resolve(getData(category.toLowerCase()))
    //     }
    //   }, 2000)
    // })
    // result = await _result

    const productId = getProductIdFromPathname(window.location.pathname)

    this.setState({loading: true, error: null})

    let result, error
    try {
      // to simulate fake loading state
      // let _result = await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve(getProduct(productId))
      //   }, 2000)
      // })
      // to simulate fake error state
      // let _result = await new Promise((_, reject) => {
      //   setTimeout(() => {
      //     reject(new Error("Errr"))
      //   }, 2000)
      // })
      // result = await _result

      result = await getProduct(productId)
    } catch (e) {
      error = e
    }

    if (error) {
      this.setState({error, loading: false})
    }

    if (result) {
      const product = result.data.product

      let productAttrs = {}

      product.attributes.forEach((attr) => {
        if (attr.type === "swatch") {
          productAttrs[attr.name] = attr.items[0].value
        } else if (attr.type === "text") {
          productAttrs[attr.name] = attr.items[0].value
        }
      })

      this.setState({loading: false, error: null, productAttrs, product})
    }
  }

  async componentDidMount() {
    this.getProduct()
  }

  componentWillUnmount() {
    this.context.setShowCartOverlay(false)
    cancelRequest("product")
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

  render() {
    const {setAttribute} = this
    const {product, productAttrs, loading, error} = this.state
    const {addToCart, currency, setShowCartOverlay} = this.context
    const cur = product.prices?.find((price) => {
      return price.currency.label === currency.label
    })

    let swatchAttrs = [],
      textAttrs = []
    product.attributes?.forEach((attr) => {
      if (attr.type === "swatch") {
        swatchAttrs.push({...attr})
      } else if (attr.type === "text") {
        textAttrs.push({...attr})
      }
    })

    if (loading) {
      return <div className={styles.loading}>loading...</div>
    }

    if (error) {
      return (
        <div className={styles.error}>
          Something went wrong while fetching product's data{" "}
          <button onClick={this.getProduct}>Refresh!</button>
        </div>
      )
    }

    return (
      <div className={styles.container}>
        <ProductImagesSlider
          urls={product.gallery}
          productName={product.name}
        />
        <div className={styles.productInfo}>
          <h2 className={styles.productBrand}>{product.brand}</h2>
          <h2 className={styles.productName}>{product.name}</h2>
          {(textAttrs.length > 0 || swatchAttrs.length > 0) && (
            <div className={styles.productAttrs}>
              {swatchAttrs.length > 0
                ? swatchAttrs.map((attr) => {
                    return (
                      <div key={attr.name} className={styles.swatchAttrs}>
                        <div key={attr.name} className={styles.swatchAttr}>
                          <div className={styles.attrName}>
                            {attr.name.toUpperCase()}:
                          </div>
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
                                    setAttribute(attr.name, item.value)
                                  }}
                                />
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })
                : null}
              {textAttrs.length > 0
                ? textAttrs.map((attr) => {
                    return (
                      <div key={attr.name} className={styles.textAttrs}>
                        <div key={attr.name} className={styles.textAttr}>
                          <div className={styles.attrName}>
                            {attr.name.toUpperCase()}:
                          </div>
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
                                    setAttribute(attr.name, item.value)
                                  }}
                                >
                                  {item.value}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })
                : null}
            </div>
          )}
          <div className={styles.price}>
            <h2 className={styles.heading}>PRICE:</h2>
            <h2 className={styles.priceValue}>
              {cur?.currency.symbol} {cur?.amount}
            </h2>
          </div>
          <div className={styles.addToCart}>
            <button
              className={styles.addToCartBtn}
              onClick={() => {
                addToCart({
                  product: {...product},
                  selectedAttrs: {...productAttrs},
                  amount: 1,
                })
                setShowCartOverlay(true)
                window.scrollTo({
                  top: 0,
                  left: 0,
                })
              }}
            >
              ADD TO CART
            </button>
          </div>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{__html: product.description}}
          />
        </div>
      </div>
    )
  }
}

export default Product
