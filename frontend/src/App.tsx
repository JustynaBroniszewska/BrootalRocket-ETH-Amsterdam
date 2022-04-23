import { Layout } from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Earn } from "./pages/Earn";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/earn" element={<Earn />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
