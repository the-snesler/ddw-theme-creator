import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import Layout from "./components/layout"
import Home from "./pages/home"
import Create from "./pages/create"
import Result from "./pages/result"
import "./styles/global.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/ddw-theme-creator/">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
);
