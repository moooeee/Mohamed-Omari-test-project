let categoriesController = new AbortController()
let dataController = new AbortController()
let productController = new AbortController()
let currenciesController = new AbortController()

function getCategories() {
  categoriesController = new AbortController()

  return fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: categoriesController.signal,
    body: JSON.stringify({
      query: `
        query {
          categories {
            name
          }
        }
      `,
    }),
  })
    .then(
      (res) => res.json(),
      (e) => console.error(e)
    )
    .then((result) => result)
}

function getData(category) {
  dataController = new AbortController()

  return fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: dataController.signal,
    body: JSON.stringify({
      query: `
        query(
          $category: String!
        ) {
          category(input: {title: $category}) {
            products {
              name
              id
              inStock
              gallery
              description
              prices {
                currency {
                  label
                }
              }
              brand
              prices {
                currency {
                  label
                  symbol
                }
                amount
              }
              attributes {
                type
                name
                items {
                  displayValue
                  value
                  id
                }
              }
            }
          }
        }
      `,
      variables: {
        category,
      },
    }),
  })
    .then(
      (res) => res.json(),
      (e) => console.log(e)
    )
    .then((result) => result)
}

function getCurrencies() {
  currenciesController = new AbortController()

  return fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: currenciesController.signal,
    body: JSON.stringify({
      query: `
        query {
          currencies {
            label
            symbol
          }
        }
      `,
    }),
  })
    .then(
      (res) => res.json(),
      (e) => console.log(e)
    )
    .then((result) => result)
}

function getProduct(product) {
  productController = new AbortController()

  return fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: productController.signal,
    body: JSON.stringify({
      query: `
        query($id: String!) {
          product(id: $id) {
            id
            name
            inStock
            gallery
            description
            brand
            prices {
              amount
              currency {
                label
                symbol
              }
            }
            attributes {
              id
              name
              type
              items {
                displayValue
                value
                id
              }
            }
          }
        }
      `,
      variables: {
        id: product,
      },
    }),
  })
    .then(
      (res) => res.json(),
      (e) => console.log(e)
    )
    .then((result) => result)
}

function cancelRequest(request) {
  if (request === "categories") {
    categoriesController.abort()
  } else if (request === "data") {
    dataController.abort()
  } else if (request === "product") {
    productController.abort()
  } else if (request === "currencies") {
    currenciesController.abort()
  }
}

export {getData, getCurrencies, getProduct, getCategories, cancelRequest}
