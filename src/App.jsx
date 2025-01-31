import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes/index";
import { AppProvider } from "./context/AppContext";

const App = () => {
  return (
  
      <AppProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </AppProvider>
  );
};

export default App;