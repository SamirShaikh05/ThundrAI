import { useState, useEffect, useRef } from "react";
import { URL } from "./API";
import Input from "./Input";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IoCopy } from "react-icons/io5";
import { FaCheck, FaImage, FaVideo } from "react-icons/fa6";
import { MdAudioFile } from "react-icons/md";
import { useChat } from "./ChatContext";
import { v4 as uuidv4 } from 'uuid';
import Header from "./header";

function MainComponent() {
  const { chatHistory, setChatHistory, setNewChat, firstMessageSent, setFirstMessageSent, newChatLocked, currentConversationId } = useChat();
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const [message, setMessage] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedResponseIndex, setCopiedResponseIndex] = useState(null);
  const questionRefs = useRef([]);
   const hasSaved = useRef(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots(prev => (prev.length >= 3 ? "" : prev + "."));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setDots("");
    }
  }, [loading]);

  useEffect(() => {
    if (questionRefs.current.length > 0) {
      const last = questionRefs.current[questionRefs.current.length - 1];
      if (last) {
        last.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [chatHistory, loading]);

  const getFileIcon = (fileType, className = "w-4 h-4") => {
    if (fileType?.startsWith('image/')) return <FaImage className={className} />;
    if (fileType?.startsWith('video/')) return <FaVideo className={className} />;
    if (fileType?.startsWith('audio/')) return <MdAudioFile className={className} />;
    return <FaImage className={className} />;
  };

  const handleRequest = async (parts = null) => {
    const currentMessage = message;
    const messageParts = parts || [{ text: currentMessage }];

    if (!parts && !currentMessage.trim()) return;

    setMessage("");
    const files = messageParts.filter(part => part.inline_data).map(part => ({
      mime_type: part.inline_data.mime_type,
      data: part.inline_data.data
    }));
    const newChatItem = {
      question: currentMessage,
      answer: "",
      id: uuidv4(),
      files,
      conversationId: currentConversationId
    };
    const currentChat = [...chatHistory, newChatItem];
    setChatHistory(currentChat);
    setLoading(true);

    const payload = {
      contents: [{
        parts: messageParts
      }]
    };

    try {
      const resp = await fetch(URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const json = await resp.json();

      if (!json.candidates || !json.candidates[0] || !json.candidates[0].content) {
        throw new Error('Invalid response format from API');
      }

      const responseText = json.candidates[0].content.parts[0].text;

      setChatHistory(prev => {
        const updated = [...prev];
        const lastChat = { ...updated[updated.length - 1], answer: responseText };
        updated[updated.length - 1] = lastChat;
       
        if (!hasSaved.current && user) {
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats/${user._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: lastChat.question,
              answer: lastChat.answer,
              files: lastChat.files,
              conversationId: lastChat.conversationId
            })
          }).catch(err => console.error("DB save error:", err));
        }
        hasSaved.current = true;

        if (!firstMessageSent && !newChatLocked.current) { 
          setNewChat(prev => [...prev, updated]); 
          setFirstMessageSent(true);
          newChatLocked.current = true; 
        } else {
          setNewChat(prev => {
            const newPrev = [...prev];
            newPrev[newPrev.length - 1] = [...updated];
            return newPrev;
          });
        }

        return updated;
      });
    } catch (err) {
      console.error("Error:", err);
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer: "Sorry, there was an error processing your request. Please try again."
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRequest();
    }
  };

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleCopyResponse = (ans, index) => {
    navigator.clipboard.writeText(ans);
    setCopiedResponseIndex(index);
    setTimeout(() => setCopiedResponseIndex(null), 2500);
  };

  function parseFormattedText(text) {
    return text.split(/(\*\*.+?\*\*|\*.+?\*|`.+?`)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <span key={j} className="font-semibold text-white">{part.slice(2, -2).replace(/`(.+?)`/g, "$1")}</span>;
      } else if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={j} className="italic text-neutral-100">{part.slice(1, -1).replace(/`(.+?)`/g, "$1")}</em>;
      } else if (part.startsWith("`") && part.endsWith("`")) {
        return <span key={j} className="font-mono bg-zinc-700 px-1 py-0.5 rounded text-white text-sm sm:text-base">{part.slice(1, -1)}</span>;
      } else {
        return <span key={j}>{part}</span>;
      }
    });
  }

  function parseMarkdownTable(markdown) {
    const lines = markdown.trim().split("\n");
    const headers = lines[0]
      .split("|")
      .map(cell => cell.trim())
      .filter(cell => cell !== "");
    const rows = lines.slice(2).map((row) =>
      row
        .split("|")
        .map(cell => cell.trim())
        .filter(cell => cell !== "")
        .map(cell => {
          const boldMatch = /^\*\*(.+)\*\*$/.exec(cell);
          if (boldMatch) return <strong key={Math.random()}>{boldMatch[1]}</strong>;
          return cell;
        })
    );

    return (
      <div className="overflow-x-auto rounded-2xl max-w-[90vw] sm:max-w-[80vw] md:max-w-2xl lg:max-w-3xl border border-zinc-600 my-4 mr-2">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-600/40">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2 border border-zinc-600 text-sm sm:text-base font-semibold text-white"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className="bg-zinc-900 text-neutral-200 text-sm sm:text-base"
              >
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2 border border-zinc-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-zinc-900">
      <Header />
      {
        chatHistory.length > 0 ? (
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <div className="max-w-[90vw] sm:max-w-[80vw] md:max-w-2xl lg:max-w-3xl mx-auto px-4 pt-8 pb-32 w-full">
              <div className="text-white leading-relaxed whitespace-pre-wrap">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex justify-end">
                      <div className="flex flex-col items-end gap-2">
                        {/* Display uploaded files */}
                        {chat.files && chat.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 max-w-md">
                            {chat.files.map((file, fileIndex) => (
                              <div key={fileIndex} className="flex items-center gap-2 bg-blue-600/20 border border-blue-600/40 rounded-lg px-3 py-2">
                                {getFileIcon(file.mime_type, "w-3 h-3 text-blue-400")}
                                <span className="text-blue-400 text-xs">
                                  {file.mime_type.split('/')[0]} file
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <span
                          ref={(el) => (questionRefs.current[index] = el)}
                          className="text-white font-medium whitespace-pre-wrap text-sm sm:text-base w-fit py-3 pl-4 pr-5 bg-blue-700 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl scroll-mt-10"
                        >
                          {chat.question.trim()}
                        </span>
                      </div>
                    </div>
                    <div className={`${chat.answer.includes("```") ? "mr-3" : "flex items-start gap-3"} mt-7`}>
                      <div className="flex items-center gap-3 mb-3">
                        <img src="/logo.svg" className={chat.answer ? "size-4 sm:size-5 md:size-6 mt-4.5 shrink-0" : "hidden"} />
                        <span className={chat.answer.includes("```") ? "text-white font-semibold text-sm sm:text-base md:text-lg mt-4.5" : "hidden"}>Here's the code block:</span>
                      </div>
                      <div className="text-neutral-100 whitespace-pre-wrap text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 ml-4">
                        {(() => {
                          const lines = chat.answer.split("\n");
                          const blocks = [];
                          let insideCode = false;
                          let codeLang = "";
                          let codeLines = [];

                          for (let i = 0; i < lines.length; i++) {
                            const line = lines[i];
                            const trimmed = line.trim();

                            if (trimmed.includes('|')) {
                              let j = i;
                              const tableLines = [];
                              while (j < lines.length && lines[j].includes('|') && !lines[j].startsWith("**") && !lines[j].startsWith("```")) {
                                tableLines.push(lines[j]);
                                j++;
                              }
                              if (tableLines.length >= 3 && tableLines[1].includes('-')) {
                                const tableText = tableLines.join('\n');
                                blocks.push(<div key={`table-${i}`}>{parseMarkdownTable(tableText)}</div>);
                                i = j - 1;
                                continue;
                              }
                            }

                            if (trimmed.startsWith("```")) {
                              if (!insideCode) {
                                insideCode = true;
                                codeLang = trimmed.replace("```", "").trim();
                              } else {
                                insideCode = false;
                                const capturedCode = [...codeLines];
                                blocks.push(
                                  <div key={`code-${i}`} className="w-full my-6 rounded-xl overflow-hidden border border-zinc-500/30 hover:ring-1 hover:ring-zinc-400/35 bg-zinc-800/40 backdrop-blur-lg shadow-xl transition-all duration-400">
                                    <div className="flex items-center justify-between px-4 py-2 bg-zinc-600/40 border border-zinc-500/30 select-none">
                                      <span className="text-xs sm:text-sm font-medium text-zinc-300 tracking-wide uppercase">
                                        {codeLang || "text"}
                                      </span>
                                      <button
                                        onClick={() => handleCopy(capturedCode.join("\n"), i)}
                                        className="flex items-center gap-2 hover:cursor-pointer text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200"
                                      >
                                        {copiedIndex === i ? (
                                          <>
                                            <FaCheck className="text-zinc-400" />
                                            Copied
                                          </>
                                        ) : (
                                          <>
                                            <IoCopy className="text-zinc-400" />
                                            Copy
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <SyntaxHighlighter
                                      language={codeLang || "text"}
                                      style={oneDark}
                                      showLineNumbers
                                      wrapLongLines
                                      customStyle={{
                                        margin: 0,
                                        padding: '1rem',
                                        background: 'transparent',
                                        fontSize: '0.8rem',
                                        lineHeight: '1.5',
                                        sm: { fontSize: '0.9rem', lineHeight: '1.6' }
                                      }}
                                    >
                                      {capturedCode.join("\n")}
                                    </SyntaxHighlighter>
                                  </div>
                                );
                                codeLines = [];
                                codeLang = "";
                              }
                              continue;
                            }

                            if (insideCode) {
                              codeLines.push(line);
                              continue;
                            }

                            if (/^\*\*.+\*\*:?$/.test(trimmed)) {
                              const headingText = trimmed.replace(/^\*\*(.+)\*\*:?$/, '$1');
                              blocks.push(<h2 key={i} className="font-bold text-lg sm:text-xl md:text-2xl text-white mb-3 mt-6">{headingText}</h2>);
                              continue;
                            }

                            if (/^(\* |- )/.test(trimmed)) {
                              blocks.push(
                                <div key={i} className="flex items-start gap-3 my-2">
                                  <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                                  <p className="text-neutral-200 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8">{parseFormattedText(trimmed.replace(/^(\* |- )/, ""))}</p>
                                </div>
                              );
                              continue;
                            }

                            if (trimmed !== "") {
                              blocks.push(<p key={i} className="text-neutral-200 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 mt-3">{parseFormattedText(trimmed)}</p>);
                            }
                          }

                          return blocks;
                        })()}
                      </div>
                    </div>
                    {chat.answer && (
                      <div className="flex justify-start mt-7 ml-7">
                        <button
                          onClick={() => handleCopyResponse(chat.answer, index)}
                          className="flex items-center gap-2 py-1.5 px-2 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-zinc-700/45 hover:bg-zinc-700 rounded-lg shadow transition duration-300 ease-in-out focus:outline-none cursor-pointer"
                        >
                          {copiedResponseIndex === index ? (
                            <>
                              <FaCheck className="text-zinc-300" />
                              Copied
                            </>
                          ) : (
                            <>
                              <IoCopy className="text-zinc-300" />
                              Copy Response
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-3 mt-4 px-4">
                    <img src="/logo.svg" className="size-6 sm:size-8 animate-pulse shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-neutral-100 font-medium text-sm sm:text-base animate-pulse">Thundr is thinking{dots}</span>
                      <span className="text-xs sm:text-sm text-neutral-500">Please wait...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center px-4 text-center">
            <h1 className="text-center font-extrabold pr-0.5 animated-gradient-text tracking-tight text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug max-w-3xl">
              Hi there! What can I do for you?
            </h1>
          </div>
        )
      }
      <Input handleKeyDown={handleKeyDown} handleRequest={handleRequest} chatHistory={chatHistory} message={message} setMessage={setMessage} hasSaved={hasSaved} />
    </div>
  );
}

export default MainComponent;