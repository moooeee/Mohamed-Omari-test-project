import {Component} from "react"
import styles from "./styles/category.module.scss"
import ProductCard from "../components/productCard"
import {Context} from "../context/context"
import {getData, cancelRequest} from "../api/getData"

class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: "",
      products: [],
      loading: false,
      error: null,
    }

    this.getProducts = this.getProducts.bind(this)
  }

  static contextType = Context

  async getProducts() {
    const {category} = this.context

    this.setState({loading: true, error: null})

    let result, error
    try {
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

      result = await getData(category.toLowerCase())
    } catch (e) {
      error = e
    }

    if (error) {
      this.setState({error, loading: false, products: []})
    } else if (result) {
      this.setState({
        category,
        products: result.data.category.products,
        loading: false,
        error: null,
      })
    }
  }

  async componentDidMount() {
    if (this.context.category) {
      this.getProducts()
    }
  }

  async componentDidUpdate() {
    const context = this.context

    if (
      this.state.category !== context.category &&
      !this.state.loading &&
      !this.state.error
    ) {
      cancelRequest("data")
      this.getProducts()
    }
  }

  componentWillUnmount() {
    this.context.setShowCartOverlay(false)
    cancelRequest("data")
  }

  render() {
    const {products, loading, error} = this.state
    const {category} = this.context

    return (
      <main className={styles.main}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{category}</h2>
          {loading && <div className={styles.loading}>loading...</div>}
        </div>
        {error ? (
          <div>
            Somthing went wrong!{" "}
            <button
              onClick={() => {
                this.getProducts()
              }}
            >
              refresh
            </button>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {products?.map((product) => {
              return <ProductCard product={product} key={product.id} />
            })}
            {loading && <div className={styles.loadingOverlay}></div>}
          </div>
        )}
      </main>
    )
  }
}

export default Category
