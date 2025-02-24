import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import SongsList from "./components/SongsList";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
                <SongsList />
      </div>
    </Provider>
  );
};

export default App;
