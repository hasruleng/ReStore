import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import Catalog from "../../features/catalog/Catalog";
import Header from "./Header";


function App() { // functional component, a function that return jsx (html a look-alike)
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark':'light'
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea':'#121212'
      }
    }
  })

  function handleThemeChange(){
    setDarkMode(!darkMode);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
        {/* <h1 style={{color:'blue'}}>Re-store</h1> */}
        <Catalog />
      </ThemeProvider>
    </>
  );
}

export default App;
