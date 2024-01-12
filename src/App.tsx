import "./App.css";
import UserList from "./components/user-list/UserList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserPosts from "./components/user-posts/UserPosts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/:id" element={<UserPosts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
