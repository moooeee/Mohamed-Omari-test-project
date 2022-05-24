import {Component} from "react"
import {NavLink} from "react-router-dom"
import {cancelRequest, getCategories} from "../api/getData"
import {Context} from "../context/context"
import styles from "./styles/nav.module.scss"
import {motion} from "framer-motion"
import {capitalizeFirstChar} from "../utils/capitalizeFirstChar"

class Nav extends Component {
  static contextType = Context

  render() {
    const {setCategory, category} = this.context
    const {items} = this.props

    return (
      <ul className={styles.nav}>
        {items.length > 0
          ? items.map((item) => {
              const name = capitalizeFirstChar(item.name)
              return (
                <li key={item.name}>
                  <NavLink
                    className={styles.navItem}
                    to="/"
                    onClick={() => {
                      setCategory(name)
                    }}
                    data-selected={category === name}
                  >
                    {name.toUpperCase()}
                    {category === name && (
                      <motion.div
                        className={styles.underline}
                        layoutId="underline"
                      />
                    )}
                  </NavLink>
                </li>
              )
            })
          : null}
      </ul>
    )
  }
}

export default Nav
