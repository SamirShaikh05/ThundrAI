import { Link, useNavigate } from "react-router";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { useState } from "react";
import { useChat } from "./ChatContext";

function Login() {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const {login} = useChat();
        const navigate = useNavigate();

        const handleSubmit = async(e) => {
            e.preventDefault();
            const res = await fetch("http://localhost:3000/api/user/Login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email, password})
            })
            const data = await res.json();
            if(res.ok){
                login(data.user);
                navigate('/');
            }
        setPassword("");
        setEmail("");
        }

    return (
        <div className="bg-slate-900 flex justify-center items-center min-h-screen px-4">
            <div
                className="relative p-[3px] rounded-2xl animate-border shadow-xl shadow-violet-300/50"
                style={{
                    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #22c55e, #ec4899, #f97316, #06b6d4, #3b82f6, #8b5cf6)',
                    backgroundSize: '400% 400%'
                }}
            >

                <div className="bg-slate-700 rounded-2xl p-8 w-[85vw] vs:w-[60vw] lg:w-[40vw] xl:w-[30vw] min-h-[75vh] select-none">
                    <Link to="/"><IoChevronBackCircleOutline
                      className="size-7 shrink-0 text-zinc-100 transition-all duration-200 ease-in-out hover:cursor-pointer hover:text-white hover:scale-110 hover:drop-shadow-lg"/></Link>

                    <h2 className="text-white text-3xl font-bold text-center mb-15 mt-1">Login to Thundr</h2>

                    <form className="flex flex-col gap-6 items-center" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            autoComplete="current-email"
                            className="w-full py-3 px-4 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email} onChange={e=>setEmail(e.target.value)}/>
                        <input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Password"
                            className="w-full py-3 px-4 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                       value={password} onChange={e=>setPassword(e.target.value)} />
                        <button
                            type="submit"
                            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 cursor-pointer"
                        >
                            Login
                        </button>
                        <div className="flex w-full justify-around gap-5 mb-3">
                            <div className="flex items-center justify-center gap-2 py-3 bg-white text-white font-semibold px-4 rounded-lg transition duration-300 cursor-pointer"><img src="/google.jpg" className="size-5 shrink-0" /><h1 className="text-black text-sm sm:block hidden">Login with Google</h1></div>
                            <div className="flex items-center justify-center gap-2 py-3 bg-white text-white font-semibold px-4 rounded-lg transition duration-300 cursor-pointer"><img src="/Apple_logo_black.svg" className="size-5 shrink-0" /><h1 className="text-black text-sm sm:block hidden">Login with Apple</h1></div>
                        </div>

                        <Link to="/Signup"><div className="text-zinc-100 hover:underline hover:cursor-pointer">Don't have an account? Make one!</div></Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
