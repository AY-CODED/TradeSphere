import { BrowserRouter } from "react-router-dom";
import AppProviders from "./providers";
import AppRoutes from "./routes/AppRoutes";

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