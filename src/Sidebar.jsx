// import { SiThunderstore } from "react-icons/si";
// import { RiDeleteBin6Fill } from "react-icons/ri";
// import { useChat } from './ChatContext';
// import { RxHamburgerMenu } from "react-icons/rx";
// import { useState } from "react";
// import { Link } from "react-router"
// import Profile from "./Profile";
// import { v4 as uuidv4 } from 'uuid';

// function Sidebar() {
//     const { setChatHistory, newchat, loadChat, setFirstMessageSent, newChatLocked, chatHistory, user, logout, setCurrentConversationId } = useChat();
//     const [clickBurg, setClickBurg] = useState(false);
//     const [selectedChatIndex, setSelectedChatIndex] = useState(null);
//     const [clickSetting, setClickSetting] = useState(false);

//     const handleAddchat = () => {
//         setChatHistory([]);
//         setSelectedChatIndex(null);
//         setFirstMessageSent(false);
//         newChatLocked.current = false;
//         setCurrentConversationId(uuidv4());
//     };

//     const handleLoadChat = (index) => {
//         loadChat(index);
//         setSelectedChatIndex(index);
//     };

//     return (
//         <div className={`group group/sidebar h-screen ${clickBurg ? "w-50 md:w-65 lg:w-72" : "w-15 md:w-20"} w-15 md:w-20 hover:w-50 md:hover-65 lg:hover:w-72 bg-zinc-900 transition-all duration-500 ease-in-out overflow-hidden flex flex-col border-r border-zinc-800 shadow-xl select-none`}>
    
//             <div className={`${clickBurg ? "flex items-center justify-between mb-4" : "group-hover:flex group-hover:items-center group-hover:justify-between group-hover:mb-4"} mt-6 transition-all duration-300 ${clickBurg ? "mx-5" : "group-hover:mx-5"}`}>

//                 <div className={`flex items-center ${clickBurg ? "justify-start" : "justify-center group-hover:justify-start"} gap-3 p-4 ${clickBurg ? "py-3" : "group-hover:py-3"} hover:cursor-pointer transition-all duration-300 hover:bg-zinc-800 rounded-xl group/header`}>
//                     <SiThunderstore className="text-white size-7 shrink-0 group-hover/header:scale-110 transition-transform duration-200" />
//                     <h1 className={`text-2xl  font-bold text-white ${clickBurg ? "hidden lg:block" : "hidden lg:group-hover:block"} tracking-wide`}>
//                         ThundrAI
//                     </h1>
//                 </div>

//                 <div
//                     className={`flex items-center gap-3 p-3 ${clickBurg ? "block bg-zinc-700/50" : "xl:hidden block group-hover:block  group-hover:ml-12 group-hover:md:ml-20 group-hover:lg:ml-0"} justify-${clickBurg ? "start" : "center"} hover:bg-zinc-800 rounded-xl hover:cursor-pointer transition-all duration-200 group/Hamburger`}
//                     onClick={() => setClickBurg(!clickBurg)}
//                 >
//                     <RxHamburgerMenu className={`shrink-0 size-6 text-white opacity-90 group-hover/Hamburger:opacity-100 transition-all duration-300`} />
//                 </div>

//             </div>

//             <div className={`flex-1 mb-5 flex flex-col ${clickBurg ? "items-start mx-4" : "items-center group-hover:items-start group-hover:mx-4"} overflow-hidden`}>
                
//                 <div className={`flex items-center ${clickBurg ? "w-full mt-0" : "group-hover:w-full mt-0"} mt-2 p-3 hover:bg-zinc-800 rounded-xl hover:cursor-pointer gap-3 transition-all duration-200 group/newchat`} onClick={handleAddchat}>
//                     <img src="/newchat.svg" className="shrink-0 size-5 vs:size-6 group-hover/newchat:scale-110 transition-transform duration-200" />
//                     <h1 className={`text-white text-sm vs:text-base font-medium truncate overflow-hidden whitespace-nowrap ${clickBurg ? "block" : "hidden group-hover:block"} text-left`}>
//                         New chat
//                     </h1>
//                 </div>

//                 {newchat.length > 0 && (
//                     <div className="w-full mt-6 mb-5 px-3">
//                         <p className={`text-sm text-zinc-400 font-medium ${clickBurg ? "block" : "hidden group-hover:block"} uppercase tracking-wider`}>
//                             Recent chats
//                         </p>
//                     </div>
//                 )}

                
//                 <div className={`overflow-y-auto flex-1 w-full group/sidebar ${clickBurg ? "block" : "hidden group-hover:block"}`}>
//                     {newchat.length > 0 ? (
//                         [...newchat].reverse().map((chatMessage, reverseIndex) => {
//                             const actualIndex = newchat.length - 1 - reverseIndex;
//                             const isSelected = selectedChatIndex === actualIndex;
//                             const isCurrentNewChat = chatHistory.length > 0 && selectedChatIndex === null && actualIndex === newchat.length - 1;

//                             return (
//                                 <div
//                                     key={actualIndex}
//                                     className={`flex items-center px-3 py-2.5 mx-2 ${clickBurg ? "mx-3" : "group-hover/sidebar:mx-3"} rounded-xl hover:cursor-pointer gap-3 transition-all duration-200 ease-in-out mb-1 ${(isSelected || isCurrentNewChat)
//                                         ? "bg-zinc-800 text-white"
//                                         : "hover:bg-zinc-800 text-zinc-300"
//                                         } group/chat`}
//                                     onClick={() => handleLoadChat(actualIndex)}
//                                 >
//                                     <span className="text-base font-normal truncate w-full">
//                                         {chatMessage[0]?.question?.charAt(0).toUpperCase() + chatMessage[0]?.question?.slice(1, 50) + (chatMessage[0]?.question?.length > 50 ? "..." : "") || "Untitled"}
//                                     </span>
//                                    {
//                                      user && 
//                                     <RiDeleteBin6Fill className="size-5  hidden group-hover/chat:block mr-3 group-hover/chat:mr-0 transition-all duration-1000 ease-in-out"/>
//                                     }
//                                 </div>
//                             );
//                         })
//                     ) : (
//                         <div className={`px-6 py-4 text-center ${clickBurg ? "block" : "hidden group-hover:block"}`}>
//                             <p className="text-zinc-500 text-sm">No recent chats</p>
//                         </div>
//                     )}
                  
//                 </div>
//             </div>

//             <div className="relative mt-auto">
//                 {clickSetting && (
//                     <div className={`${clickBurg ? "block" : "hidden group-hover:block"} absolute bottom-full left-4 right-4 mb-2 p-2 rounded-xl bg-zinc-800 shadow-lg border border-zinc-700`}>
//                         {
//                             user ?
//                                 <div onClick={logout} className={`${clickBurg ? "md:hidden block" : "md:group-hover:hidden group-hover:block"} text-white py-2  px-3 hover:bg-zinc-700 hover:cursor-pointer mb-1 rounded-lg transition-colors duration-200`}>Log out</div> :
//                                 <>
//                                     <Link to="/Login">
//                                         <div className={`${clickBurg ? "md:hidden block" : "md:group-hover:hidden group-hover:block"} text-white py-2  px-3 hover:bg-zinc-700 hover:cursor-pointer mb-1 rounded-lg transition-colors duration-200`}>
//                                             Login
//                                         </div>
//                                     </Link>
//                                     <Link to="/SignUP">
//                                         <div className={`${clickBurg ? "md:hidden block" : "md:group-hover:hidden group-hover:block"} text-white py-2 px-3 w-full hover:bg-zinc-700 hover:cursor-pointer rounded-lg transition-colors duration-200`}>
//                                             Signup
//                                         </div>
//                                     </Link>
//                                 </>
//                         }
//                         <div className={`${clickBurg ? "block" : "hidden group-hover:block"} text-white py-2 px-3 hover:bg-zinc-700 hover:cursor-pointer rounded-lg transition-colors duration-200`}>
//                             About This
//                         </div>
//                     </div>
//                 )}

//                 {
//                     user &&
//                     <div className={`flex items-center gap-3 p-3 ${clickBurg ? "justify-start mx-4" : "justify-center group-hover:justify-start group-hover:mx-4"} mb-6 hover:bg-zinc-800 rounded-xl hover:cursor-pointer transition-all duration-200 group/settings`}   onClick={() => {
//     setClickSetting((prev) => !prev);
//     if (window.innerWidth < 900 && !clickBurg) {
//       setClickBurg(true);
//     }
//   }}>

//                         <>
//                             <span className={`${clickBurg ? "scale-105" : "scale-110 p-[2px] rounded-full bg-zinc-300/85 group-hover:p-0 group-hover:scale-105"}`}><Profile /></span>
//                             <h1 className={`text-white text-lg font-normal truncate overflow-hidden whitespace-nowrap ${clickBurg ? "block" : "hidden group-hover:block"} text-left`}>
//                                 {user.username}
//                             </h1>
//                         </>

//                     </div>
//                 }

//             </div>
//         </div>
//     )
// };

// export default Sidebar;


// Sidebar.js
import { SiThunderstore } from "react-icons/si";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useChat } from './ChatContext';
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import { Link } from "react-router";
import Profile from "./Profile";
import { v4 as uuidv4 } from 'uuid';

function Sidebar() {
  const {
    setChatHistory,
    newchat,
    loadChat,
    setFirstMessageSent,
    newChatLocked,
    chatHistory,
    user,
    logout,
    setCurrentConversationId,
    setNewChat,
  } = useChat();
  const [clickBurg, setClickBurg] = useState(false);
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);
  const [clickSetting, setClickSetting] = useState(false);

  const handleAddchat = () => {
    setChatHistory([]);
    setSelectedChatIndex(null);
    setFirstMessageSent(false);
    newChatLocked.current = false;
    setCurrentConversationId(uuidv4());
  };

  const handleLoadChat = (index) => {
    loadChat(index);
    setSelectedChatIndex(index);
  };

  const handleDeleteChat = async (index) => {
    if (!user) return; // Ensure user is logged in
    const conversationId = newchat[index][0]?.conversationId;
    if (!conversationId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/chats/${user._id}/${conversationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete conversation');
      }

      setNewChat((prev) => {
        const updated = [...prev];
        updated.splice(index, 1); 
        return updated;
      });

      if (selectedChatIndex === index || (selectedChatIndex === null && index === newchat.length - 1)) {
        setChatHistory([]);
        setSelectedChatIndex(null);
        setFirstMessageSent(false);
        setCurrentConversationId(uuidv4());
      } else if (selectedChatIndex > index) {
        setSelectedChatIndex((prev) => prev - 1);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete conversation: ${err.message}`);
    }
  };

  return (
    <div
      className={`group group/sidebar h-screen ${
        clickBurg ? 'w-50 md:w-65 lg:w-72' : 'w-15 md:w-20'
      } w-15 md:w-20 hover:w-50 md:hover-65 lg:hover:w-72 bg-zinc-900 transition-all duration-500 ease-in-out overflow-hidden flex flex-col border-r border-zinc-800 shadow-xl select-none`}
    >
      <div
        className={`${
          clickBurg ? 'flex items-center justify-between mb-4' : 'group-hover:flex group-hover:items-center group-hover:justify-between group-hover:mb-4'
        } mt-6 transition-all duration-300 ${clickBurg ? 'mx-5' : 'group-hover:mx-5'}`}
      >
        <div
          className={`flex items-center ${
            clickBurg ? 'justify-start' : 'justify-center group-hover:justify-start'
          } gap-3 p-4 ${clickBurg ? 'py-3' : 'group-hover:py-3'} hover:cursor-pointer transition-all duration-300 hover:bg-zinc-800 rounded-xl group/header`}
        >
          <SiThunderstore className="text-white size-7 shrink-0 group-hover/header:scale-110 transition-transform duration-200" />
          <h1
            className={`text-2xl font-bold text-white ${
              clickBurg ? 'hidden lg:block' : 'hidden lg:group-hover:block'
            } tracking-wide`}
          >
            ThundrAI
          </h1>
        </div>

        <div
          className={`flex items-center gap-3 p-3 ${
            clickBurg
              ? 'block bg-zinc-700/50'
              : 'xl:hidden block group-hover:block group-hover:ml-12 group-hover:md:ml-20 group-hover:lg:ml-0'
          } justify-${clickBurg ? 'start' : 'center'} hover:bg-zinc-800 rounded-xl hover:cursor-pointer transition-all duration-200 group/Hamburger`}
          onClick={() => setClickBurg(!clickBurg)}
        >
          <RxHamburgerMenu
            className={`shrink-0 size-6 text-white opacity-90 group-hover/Hamburger:opacity-100 transition-all duration-300`}
          />
        </div>
      </div>

      <div
        className={`flex-1 mb-5 flex flex-col ${
          clickBurg ? 'items-start mx-4' : 'items-center group-hover:items-start group-hover:mx-4'
        } overflow-hidden`}
      >
        <div
          className={`flex items-center ${clickBurg ? 'w-full mt-0' : 'group-hover:w-full mt-0'} mt-2 p-3 hover:bg-zinc-800 rounded-xl hover:cursor-pointer gap-3 transition-all duration-200 group/newchat`}
          onClick={handleAddchat}
        >
          <img
            src="/newchat.svg"
            className="shrink-0 size-5 vs:size-6 group-hover/newchat:scale-110 transition-transform duration-200"
          />
          <h1
            className={`text-white text-sm vs:text-base font-medium truncate overflow-hidden whitespace-nowrap ${
              clickBurg ? 'block' : 'hidden group-hover:block'
            } text-left`}
          >
            New chat
          </h1>
        </div>

        {newchat.length > 0 && (
          <div className="w-full mt-6 mb-5 px-3">
            <p
              className={`text-sm text-zinc-400 font-medium ${
                clickBurg ? 'block' : 'hidden group-hover:block'
              } uppercase tracking-wider`}
            >
              Recent chats
            </p>
          </div>
        )}

        <div
          className={`overflow-y-auto flex-1 w-full group/sidebar ${clickBurg ? 'block' : 'hidden group-hover:block'}`}
        >
          {newchat.length > 0 ? (
            [...newchat].reverse().map((chatMessage, reverseIndex) => {
              const actualIndex = newchat.length - 1 - reverseIndex;
              const isSelected = selectedChatIndex === actualIndex;
              const isCurrentNewChat =
                chatHistory.length > 0 && selectedChatIndex === null && actualIndex === newchat.length - 1;

              return (
                <div
                  key={actualIndex}
                  className={`flex items-center px-3 py-2.5 mx-2 ${
                    clickBurg ? 'mx-3' : 'group-hover/sidebar:mx-3'
                  } rounded-xl hover:cursor-pointer gap-3 transition-all duration-200 ease-in-out mb-1 ${
                    isSelected || isCurrentNewChat ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800 text-zinc-300'
                  } group/chat`}
                >
                  <span
                    className="text-base font-normal truncate w-full"
                    onClick={() => handleLoadChat(actualIndex)}
                  >
                    {chatMessage[0]?.question?.charAt(0).toUpperCase() +
                      chatMessage[0]?.question?.slice(1, 50) +
                      (chatMessage[0]?.question?.length > 50 ? '...' : '') || 'Untitled'}
                  </span>
                  {user && (
                    <RiDeleteBin6Fill
                      className="size-5 hidden group-hover/chat:block mr-3 group-hover/chat:mr-0 transition-all duration-500 ease-in-out hover:text-white hover:scale-110"
                      onClick={() => handleDeleteChat(actualIndex)}
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div className={`px-6 py-4 text-center ${clickBurg ? 'block' : 'hidden group-hover:block'}`}>
              <p className="text-zinc-500 text-sm">No recent chats</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-auto">
        {clickSetting && (
          <div
            className={`${
              clickBurg ? 'block' : 'hidden group-hover:block'
            } absolute bottom-full left-4 right-4 mb-2 p-2 rounded-xl bg-zinc-800 shadow-lg border border-zinc-700`}
          >
            {user ? (
              <div
                onClick={logout}
                className={`${
                  clickBurg ? 'md:hidden block' : 'md:group-hover:hidden group-hover:block'
                } text-white py-2 px-3 hover:bg-zinc-700 hover:cursor-pointer mb-1 rounded-lg transition-colors duration-200`}
              >
                Log out
              </div>
            ) : (
              <>
                <Link to="/Login">
                  <div
                    className={`${
                      clickBurg ? 'md:hidden block' : 'md:group-hover:hidden group-hover:block'
                    } text-white py-2 px-3 hover:bg-zinc-700 hover:cursor-pointer mb-1 rounded-lg transition-colors duration-200`}
                  >
                    Login
                  </div>
                </Link>
                <Link to="/SignUp">
                  <div
                    className={`${
                      clickBurg ? 'md:hidden block' : 'md:group-hover:hidden group-hover:block'
                    } text-white py-2 px-3 w-full hover:bg-zinc-700 hover:cursor-pointer rounded-lg transition-colors duration-200`}
                  >
                    Signup
                  </div>
                </Link>
              </>
            )}
            <div
              className={`${
                clickBurg ? 'block' : 'hidden group-hover:block'
              } text-white py-2 px-3 hover:bg-zinc-700 hover:cursor-pointer rounded-lg transition-colors duration-200`}
            >
              About This
            </div>
          </div>
        )}

        {user && (
          <div
            className={`flex items-center gap-3 p-3 ${
              clickBurg ? 'justify-start mx-4' : 'justify-center group-hover:justify-start group-hover:mx-4'
            } mb-6 hover:bg-zinc-800 rounded-xl hover:cursor-pointer transition-all duration-200 group/settings`}
            onClick={() => {
              setClickSetting((prev) => !prev);
              if (window.innerWidth < 900 && !clickBurg) {
                setClickBurg(true);
              }
            }}
          >
            <>
              <span
                className={`${
                  clickBurg ? 'scale-105' : 'scale-110 p-[2px] rounded-full bg-zinc-300/85 group-hover:p-0 group-hover:scale-105'
                }`}
              >
                <Profile />
              </span>
              <h1
                className={`text-white text-lg font-normal truncate overflow-hidden whitespace-nowrap ${
                  clickBurg ? 'block' : 'hidden group-hover:block'
                } text-left`}
              >
                {user.username}
              </h1>
            </>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;