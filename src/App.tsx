import React from "react";
import AppComponent from "./components/App";
import { store } from "./store/configureStore";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import "./styles/styles.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppComponent />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
};

export default App;
