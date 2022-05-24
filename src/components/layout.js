import {Component} from "react"
import {ReactComponent as Logo} from "../images/logo.svg"
import styles from "./styles/layout.module.scss"
import {Context} from "../context/context"
import CurrencySwitcher from "./currencySwitcher"
import CartOverlay from "./cartOverlay"
import {Link} from "react-router-dom"
import MobileNav from "./mobileNav"
import {cancelRequest, getCategories, getCurrencies} from "../api/getData"
import Nav from "./nav"
import {capitalizeFirstChar} from "../utils/capitalizeFirstChar"
import ErrorBoundary from "./errorBoundary"

class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: null,
      categories: [],
      loading: null,
      error: null,
    }

    this.getData = this.getData.bind(this)
  }

  async getData() {
    this.setState({loading: true, error: null})

    let result2, error
    try {
      result2 = await Promise.all([
        await getCategories(),
        await getCurrencies(),
      ])
    } catch (e) {
      error = e
    }

    if (error) {
      this.setState({error, loading: false})
      return
    }

    if (result2) {
      this.setState({
        loading: null,
        error: null,
        categories: result2[0].data.categories,
        currencies: result2[1].data.currencies,
      })

      if (!this.context.category) {
        const category = capitalizeFirstChar(result2[0].data.categories[0].name)
        this.context.setCategory(category)
      }

      if (!this.context.currency) {
        this.context.setCurrency(result2[1].data.currencies[0])
      }
    }
  }

  async componentDidMount() {
    this.getData()
  }

  componentWillUnmount() {
    cancelRequest("categories")
    cancelRequest("currencies")
  }

  static contextType = Context

  render() {
    const {children} = this.props
    const {categories, currencies} = this.state
    const {category, currency, error} = this.context

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.mobileNav}>
            <MobileNav items={categories} />
          </div>
          <nav className={styles.nav}>
            <div className={styles.spacer} />
            <Nav items={categories} />
          </nav>
          <div className={styles.logo}>
            <Link to="/">
              <Logo width={31} />
            </Link>
          </div>
          <div className={styles.actions}>
            <div className={styles.currencyWrapper}>
              {currencies && <CurrencySwitcher currencies={currencies} />}
            </div>
            <div className={styles.cartWrapper}>
              <CartOverlay />
            </div>
            <div className={styles.spacer} />
          </div>
        </div>
        {error && (
          <div>
            Something wrong happend!{" "}
            <button onClick={this.getData}>Refresh</button>
          </div>
        )}
        <ErrorBoundary>{category && currency && children}</ErrorBoundary>
      </div>
    )
  }
}

export default Layout
