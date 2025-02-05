import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes/index";
import { AppProvider } from "./context/AppContext";
// import PWAUpdatePrompt from "./components/Misc/PWAUpdatePropmt";

const App = () => {
  return (
    <>
      <AppProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </AppProvider>
      {/* <PWAUpdatePrompt /> */}
    </>
  );
};

export default App;
