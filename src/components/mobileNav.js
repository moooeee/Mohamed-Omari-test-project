import {Component, createRef} from "react"
import styles from "./styles/mobileNav.module.scss"
import {Context} from "../context/context"
import {AnimatePresence, motion} from "framer-motion"
import Portal from "./portal"
import {NavLink} from "react-router-dom"
import OutSideClickHandler from "./outsideClickHandler"

class MobileNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showNav: false,
    }

    this.mobileNavRef = createRef()
  }

  static contextType = Context

  render() {
    const {showNav} = this.state
    const {items, className} = this.props
    const {category, setCategory} = this.context

    let categoryItems = items.map((item) => item.name)

    return (
      <OutSideClickHandler
        target={this.mobileNavRef}
        cb={() => {
          this.setState({showNav: false})
        }}
      >
        <div
          ref={this.mobileNavRef}
          className={`${styles.container} ${className}`}
        >
          <button
            className={styles.trigger}
            onClick={() => this.setState({showNav: !showNav})}
          >
            {category}
          </button>
          {showNav && (
            <Portal>
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 50,
                  transition: "background-color .3s ease",
                }}
              />
            </Portal>
          )}
          <AnimatePresence>
            {showNav && (
              <motion.div
                initial={{opacity: 0, y: -5}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -5}}
                transition={{ease: "easeInOut"}}
                className={styles.dropdown}
              >
                <ul>
                  {categoryItems.length > 0
                    ? categoryItems.map((item) => {
                        item = item.charAt(0).toUpperCase() + item.slice(1)

                        return (
                          <li key={item}>
                            <NavLink
                              to="/"
                              onClick={() => {
                                setCategory(item)
                                this.setState({showNav: false})
                              }}
                              data-selected={category === item}
                            >
                              {item}
                            </NavLink>
                          </li>
                        )
                      })
                    : null}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </OutSideClickHandler>
    )
  }
}

export default MobileNav
