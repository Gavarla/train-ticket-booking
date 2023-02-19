import "./App.css";
import { ToastContainer } from "react-toastify";
import Routes from "./Routes/Routes";
import { ProSidebarProvider } from "react-pro-sidebar";
function App() {
  return (
    <div className="App">
      <ToastContainer />
      <ProSidebarProvider>
        <Routes />
      </ProSidebarProvider>
    </div>
  );
}

export default App;
