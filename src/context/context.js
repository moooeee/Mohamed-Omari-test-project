import {Component, createContext} from "react"
import {getAppState, setStateInLocalStorage} from "../utils/localStorageUtils"

export const Context = createContext()

class Provider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: null,
      currency: null,
      cart: {
        products: [],
      },
      showCartOverlay: false,
      lastInsertedItem: null,
    }

    this.setCategory = this.setCategory.bind(this)
    this.setCurrency = this.setCurrency.bind(this)
    this.addToCart = this.addToCart.bind(this)
    this.updateCart = this.updateCart.bind(this)
    this.incrementAmount = this.incrementAmount.bind(this)
    this.decrementAmount = this.decrementAmount.bind(this)
    this.setShowCartOverlay = this.setShowCartOverlay.bind(this)
    this.clearLastInsertedItem = this.clearLastInsertedItem.bind(this)
  }

  componentDidMount() {
    const appState = getAppState()

    if (appState) {
      this.setState({
        category: appState.category,
        cart: {products: appState.products},
        currency: appState.currency,
      })
    }
  }

  componentDidUpdate() {
    const {category, cart, currency} = this.state

    setStateInLocalStorage({
      category,
      products: cart.products,
      currency,
    })
  }

  setCategory(category) {
    this.setState({category})
  }

  setCurrency(currency) {
    this.setState({currency})
  }

  addToCart(product) {
    const productInCart = this.state.cart.products.find((_product) => {
      const isSameID = _product.productInfo.product.id === product.product.id

      let isSameAttrs = true
      for (let key in product.selectedAttrs) {
        if (
          product.selectedAttrs[key] !== _product.productInfo.selectedAttrs[key]
        ) {
          isSameAttrs = false
          break
        }
      }

      return isSameID && isSameAttrs
    })

    if (productInCart) {
      this.incrementAmount(
        productInCart.id,
        productInCart.productInfo.amount + product.amount
      )
    } else {
      const item = {
        id: Math.round(Math.random() * 10000000),
        productInfo: product,
      }
      this.setState({
        cart: {products: [item, ...this.state.cart.products]},
        lastInsertedItem: item.id,
      })
    }
  }

  updateCart(id, attr, value) {
    const products = this.state.cart.products
    const updatedProducts = products.map((pr) => {
      if (pr.id === id) {
        pr.productInfo.selectedAttrs[attr] = value
        return pr
      }

      return pr
    })

    this.setState({
      cart: {
        products: updatedProducts,
      },
    })
  }

  incrementAmount(product, amount) {
    let lastInsertedItemID
    const products = this.state.cart.products.map((pr) => {
      if (pr.id === product) {
        lastInsertedItemID = pr.id
        if (amount) {
          pr.productInfo.amount = amount
        } else {
          pr.productInfo.amount = pr.productInfo.amount + 1
        }

        return pr
      }
      return pr
    })

    this.setState({
      cart: {products},
      lastInsertedItem: lastInsertedItemID,
    })
  }

  decrementAmount(product) {
    let products = this.state.cart.products.map((pr) => {
      if (pr.id === product) {
        if (pr.productInfo.amount - 1 <= 0) {
          return null
        }

        pr.productInfo.amount = pr.productInfo.amount - 1
        return pr
      }

      return pr
    })

    products = products.filter(Boolean)
    setTimeout(() => {
      this.setState({cart: {products}})
    }, 0)
  }

  setShowCartOverlay(showCartOverlay) {
    this.setState({showCartOverlay})
  }

  clearLastInsertedItem() {
    this.setState({lastInsertedItem: null})
  }

  render() {
    const {children} = this.props
    const {category, currency, cart, showCartOverlay, lastInsertedItem} =
      this.state
    const {
      setCategory,
      setCurrency,
      addToCart,
      updateCart,
      incrementAmount,
      decrementAmount,
      setShowCartOverlay,
      clearLastInsertedItem,
    } = this

    return (
      <Context.Provider
        value={{
          category,
          currency,
          setCategory,
          setCurrency,
          addToCart,
          updateCart,
          incrementAmount,
          decrementAmount,
          cart,
          showCartOverlay,
          setShowCartOverlay,
          lastInsertedItem,
          clearLastInsertedItem,
        }}
      >
        {children}
      </Context.Provider>
    )
  }
}

export default Provider
