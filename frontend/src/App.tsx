import { Layout } from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Earn } from "./pages/Earn";
import { Manage } from "./pages/Manage";
import { Create } from "./pages/Create";
import { Portfolio } from "./pages/Portfolio";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/create" element={<Create />} />
          <Route path="/portfolio/:address" element={<Portfolio/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
