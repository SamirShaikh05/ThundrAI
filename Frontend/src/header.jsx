import { Link } from "react-router";
import { useChat } from "./ChatContext";
import Profile from "./Profile";

function Header() {
    const {user, logout} = useChat();
    return (
        <>
            <div className="h-16 border-b border-zinc-600/40 sticky top-0 bg-zinc-900/90 backdrop-blur-md z-50 shadow-lg select-none">
                <div className="flex items-center justify-center md:justify-around h-full">
                    <div className="text-white font-semibold text-lg md:text-xl tracking-wide hidden md:block">ThundrAI</div>
                    <div className="flex text-white gap-4 items-center">
                        {
                            user? <Link to="/"><div onClick={logout} className="hidden md:flex items-center gap-2 py-1.5 px-3 md:py-2 md:px-4  hover:bg-zinc-700 rounded-xl transition-colors duration-200 cursor-pointer">
<Profile/>
                            <span className="font-medium text-base">Log out</span>
                        </div></Link>:
                        <>
                        <Link to="/Signup"><div className="py-1 px-2 mx-2 vss:mx-5 md:mx-0 sm:py-1.5 sm:px-3 md:py-2 md:px-4 bg-zinc-700 hover:bg-zinc-600 rounded-xl transition-colors duration-200 cursor-pointer">
                            <span className="font-medium text-xs sm:text-sm md:text-base">Sign Up</span>
                        </div></Link>
                        <Link to="/Login"><div className="py-1 px-2 mx-2 vss:mx-5 md:mx-0 sm:py-1.5 sm:px-3 md:py-2 md:px-4 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors duration-200 cursor-pointer shadow-md">
                            <span className="font-medium text-xs sm:text-sm md:text-base">Login</span>
                        </div></Link>
                        </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;