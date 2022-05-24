import {Component, createRef} from "react"
import {Context} from "../context/context"
import styles from "./styles/currencySwitcher.module.scss"
import {ReactComponent as DownArrow} from "../images/downArrow.svg"
import {AnimatePresence, motion} from "framer-motion"
import Portal from "./portal"
import OutSideClickHandler from "./outsideClickHandler"
import FocusLock from "react-focus-lock"

class DropdownOption extends Component {
  constructor(props) {
    super(props)

    this.optionRef = createRef()
  }

  static contextType = Context

  render() {
    const {currency, dismiss, isSelected, setDropdownValue} = this.props

    return (
      <button
        ref={this.optionRef}
        id={`${currency.symbol}-${currency.label}`}
        onClick={() => {
          this.context.setCurrency(currency)
          dismiss()
        }}
        role="option"
        aria-selected={isSelected}
        data-selected={isSelected}
        onMouseEnter={() => {
          setDropdownValue(currency)
        }}
      >
        {currency.symbol} {currency.label}
      </button>
    )
  }
}

class CurrencySwitcherDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownValue: null,
    }

    this.setDropdownValue = this.setDropdownValue.bind(this)
    this.dropdownRef = createRef()
  }

  static contextType = Context

  componentDidMount() {
    this.dropdownRef.current?.focus()
    const {currencies} = this.props

    if (this.context.currency) {
      this.setState({dropdownValue: this.context.currency})
    } else {
      this.setState({dropdownValue: currencies[0]})
    }
  }

  setDropdownValue(value) {
    this.setState({dropdownValue: value})
  }

  render() {
    const {currencies, dismiss, triggerRef} = this.props
    const {setDropdownValue} = this
    const {dropdownValue} = this.state

    if (!dropdownValue) {
      return null
    }

    if (this.dropdownRef.current) {
      this.dropdownRef.current.focus()
    }

    return (
      <FocusLock>
        <div
          ref={this.dropdownRef}
          className={styles.dropdown}
          tabIndex={-1}
          role="listbox"
          aria-activedescendant={`${dropdownValue.symbol}-${dropdownValue.label}`}
          onKeyDown={(e) => {
            e.preventDefault()
            let selectedValueIndex = currencies.findIndex(
              (cur) => cur.label === dropdownValue.label
            )

            let nextIndex
            if (e.key === "ArrowUp") {
              nextIndex =
                selectedValueIndex - 1 < 0
                  ? currencies.length - 1
                  : selectedValueIndex - 1
              this.setState({dropdownValue: currencies[nextIndex]})
            } else if (e.key === "ArrowDown") {
              nextIndex =
                selectedValueIndex + 1 >= currencies.length
                  ? 0
                  : selectedValueIndex + 1
              this.setState({dropdownValue: currencies[nextIndex]})
            } else if (e.key === "Enter") {
              this.context.setCurrency(dropdownValue)
              dismiss()
            } else if (e.key === "Escape") {
              dismiss()
            } else if (e.key === "Home") {
              this.setDropdownValue(currencies[0])
            } else if (e.key === "End") {
              this.setDropdownValue(currencies[currencies.length - 1])
            }
          }}
        >
          <motion.div
            initial={{opacity: 0, y: -5}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -5}}
            transition={{ease: "easeInOut"}}
            className={styles.dropdownBody}
            onUnmount={() => triggerRef.current.focus()}
          >
            {currencies?.map((cur) => {
              const isSelected = cur.label === dropdownValue.label

              return (
                <DropdownOption
                  key={cur.label}
                  currency={cur}
                  dismiss={dismiss}
                  isSelected={isSelected}
                  setDropdownValue={setDropdownValue}
                >
                  {cur.symbol} {cur.label}
                </DropdownOption>
              )
            })}
          </motion.div>
        </div>
      </FocusLock>
    )
  }
}

class CurrencySwitcher extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currencies: [],
      showDropdown: false,
      dropdownValue: null,
    }

    this.currencySwitcherRef = createRef()
    this.dropdownTriggerRef = createRef()
    this.dismissDropdown = this.dismissDropdown.bind(this)
    this.setDropdownValue = this.setDropdownValue.bind(this)
    this.selectValue = this.selectValue.bind(this)
  }

  static contextType = Context

  // componentDidUpdate(_, prevState) {
  //   if (prevState.showDropdown && !this.state.showDropdown) {
  //     // this won't work because framer-motion will delay the overlay unmount until the animation is finished
  //     // and while the overlay still mounted, focus-lock won't let us focus anything outside of it, so we either need to setTimeout or focus the trigger in onUnmount callback in the overlay
  //     this.dropdownTriggerRef.current.focus()
  //   }
  // }

  setDropdownValue(value) {
    this.setState({dropdownValue: value})
  }

  selectValue(value) {
    this.context.setCurrency(value)
  }

  dismissDropdown() {
    this.setState({showDropdown: false})
  }

  render() {
    const {showDropdown} = this.state
    const {currency} = this.context
    const {dismissDropdown} = this
    const {currencies} = this.props

    if (!currency) {
      return null
    }

    const ariaRoles = {
      "aria-label": "Switch Currency",
      "aria-haspopup": "listbox",
    }

    if (showDropdown) {
      ariaRoles["aria-expanded"] = true
    }

    return (
      <OutSideClickHandler
        target={this.currencySwitcherRef}
        cb={() => this.setState({showDropdown: false})}
      >
        <div ref={this.currencySwitcherRef} className={styles.container}>
          <button
            ref={this.dropdownTriggerRef}
            className={styles.trigger}
            onClick={() => {
              this.setState({showDropdown: !showDropdown})
            }}
            {...ariaRoles}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault()
                this.setState({showDropdown: true})
              } else if (e.key === "ArrowDown") {
                e.preventDefault()
                this.setState({showDropdown: true})
              } else if (e.key === "Enter") {
                e.preventDefault()
                this.setState({showDropdown: !this.state.showDropdown})
              }
            }}
          >
            <span>{currency.symbol}</span>{" "}
            <DownArrow data-active={showDropdown} />
          </button>
          {showDropdown && (
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
            {showDropdown && (
              <CurrencySwitcherDropdown
                dismiss={dismissDropdown}
                currencies={currencies}
                triggerRef={this.dropdownTriggerRef}
              />
            )}
          </AnimatePresence>
        </div>
      </OutSideClickHandler>
    )
  }
}

export default CurrencySwitcher
