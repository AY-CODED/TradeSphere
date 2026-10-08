import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageLayout from "./layouts/PageLayouts";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;