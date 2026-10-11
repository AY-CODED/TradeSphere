import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PageLayouts = () => {
  return (
    <div className="min-h-screen bg-[#f3f6fb]">
      <Navbar />
      <div className="min-w-0 flex-1">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default PageLayouts;