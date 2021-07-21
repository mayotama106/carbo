import "../styles/destyle.css"
import "../styles/style.css"
import { Provider } from 'react-redux'
import { useStore } from '../store'

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState)
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
