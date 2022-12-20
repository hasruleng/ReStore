import { ThemeProvider } from "@emotion/react";
import { Container, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import AboutPage from "../../features/about/AboutPage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import ContactPage from "../../features/contact/ContactPage";
import HomePage from "../../features/home/HomePage";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
// import { useStoreContext } from "../context/StoreContext";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import PrivateRoute from "./PrivateRoute";
import Orders from "../../features/order/Orders";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import Inventory from "../../features/admin/Inventory";


function App() { // functional component, a function that return jsx (html a look-alike)
  // const { setBasket } = useStoreContext(); //ini pake react context
  const dispatch = useAppDispatch(); //ini pake redux toolkit
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => { // cuma sekali dijalanin pas inisialisasi aplikasi, disimpan di memori
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    /* segini diganti initApp
    const buyerId = getCookie('buyerId');
    dispatch(fetchCurrentUser());
    if (buyerId) {
      agent.Basket.get()
        // .then(basket => setBasket(basket))
        .then(basket => dispatch(setBasket(basket)))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }//*/
    initApp().then(() => setLoading(false));
  }, [initApp]) //sebelumnya dependencnya ke 'dispatch

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light'
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return <LoadingComponent message='Initializing app...' />

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer position="bottom-right" hideProgressBar />
        <CssBaseline />
        <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
        {/* <h1 style={{color:'blue'}}>Re-store</h1> */}
        <Route exact path='/' component={HomePage} />
        <Route path={'/(.+)'} render={()=> (
        <Container sx={{ mt: 4 }}>
          <Switch>
            <Route exact path='/catalog' component={Catalog} />
            <Route path='/catalog/:id' component={ProductDetails} />
            <Route path='/about' component={AboutPage} />
            <Route path='/contact' component={ContactPage} />
            <Route path='/server-error' component={ServerError} />
            <Route path='/basket' component={BasketPage} />
            <PrivateRoute path='/checkout' component={CheckoutWrapper} />
            <PrivateRoute path='/orders' component={Orders} />
            <PrivateRoute path='/inventory' component={Inventory} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route component={NotFound} />
          </Switch>
        </Container>
        )} /> 
      </ThemeProvider>
    </>
  );
}

export default App;
