import Category from "./pages/category"
import Provider from "./context/context"
import styles from "./app.module.scss"
import {Routes} from "react-router"
import {BrowserRouter, Route} from "react-router-dom"
import {lazy, Suspense} from "react"
import Layout from "./components/layout"
import Loading from "./components/loading.js"

const Cart = lazy(() => import("./pages/cart"))
const Product = lazy(() => import("./pages/product"))

function App() {
  return (
    <Provider>
      <div className={styles.app}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Category />
                </Layout>
              }
            />
            <Route
              path="/cart"
              element={
                <Layout>
                  <Suspense fallback={<Loading />}>
                    <Cart />
                  </Suspense>
                </Layout>
              }
            />
            <Route
              path="/products/:id"
              element={
                <Layout>
                  <Suspense fallback={<Loading />}>
                    <Product />
                  </Suspense>
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  )
}

export default App
