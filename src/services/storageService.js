export const getFromStorage = (key, fallbackValue) => {
  try {
    const rawValue = localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch (error) {
    console.error(`Failed to read localStorage key: ${key}`, error)
    return fallbackValue
  }
}

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to write localStorage key: ${key}`, error)
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove localStorage key: ${key}`, error)
  }
}
