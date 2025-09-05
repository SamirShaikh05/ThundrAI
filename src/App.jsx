import MainComponent from "./MainContent"
import Sidebar from "./Sidebar"
import { ChatProvider } from "./ChatContext"
import { BrowserRouter, Route, Routes } from "react-router"
import SignUP from "./SignUp"
import Login from "./Login"

function App() {

  return (
    <>
    <ChatProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={
          
          <div className="flex max-h-screen h-screen m-0 p-0 overflow-hidden">
            <Sidebar />
            <MainComponent />
          </div>
        } 
        />
        <Route path="/Signup" element={<SignUP/>}/>
        <Route path="/Login" element={<Login/>}/>
      </Routes>
      </BrowserRouter>
      </ChatProvider>
    </>

  )
}

export default App;
