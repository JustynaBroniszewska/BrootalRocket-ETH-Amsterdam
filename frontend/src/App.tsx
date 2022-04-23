import { Layout } from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Earn } from "./pages/Earn";
import { Manage } from "./pages/Manage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/manage" element={<Manage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
