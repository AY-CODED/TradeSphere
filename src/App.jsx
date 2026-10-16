import { BrowserRouter } from "react-router-dom";
import AppProviders from "./context/AppProviders";
import AppRoutes from "./pages/AppRoutes";

const App = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;