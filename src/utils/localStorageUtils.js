const localStorageKey = "$$$app-state$$$"

function getAppState() {
  const appStateInLocalStorage = localStorage.getItem(localStorageKey)
  let appState

  if (appStateInLocalStorage) {
    appState = JSON.parse(appStateInLocalStorage)
    return appState
  }
}

function setStateInLocalStorage(state) {
  const _state = JSON.stringify(state, null, 2)
  localStorage.setItem(localStorageKey, _state)
}

export {getAppState, setStateInLocalStorage}
