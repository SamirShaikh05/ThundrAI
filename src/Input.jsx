import { IoSendSharp } from "react-icons/io5";
import { FaMicrophone, FaStop, FaImage, FaVideo } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { MdAudioFile } from "react-icons/md";
import { useState, useRef } from "react";

function Input({ handleRequest, chatHistory, message, setMessage, hasSaved }) {
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordingInterval, setRecordingInterval] = useState(null);

    const handleChange = (e) => {
        setMessage(e.target.value);
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // File handling functions
    const handleFileSelect = () => {
        fileInputRef.current?.click();
        setIsDropdownOpen(false);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const supportedFiles = files.filter(file => {
            const type = file.type;
            return type.startsWith('image/') ||
                type.startsWith('video/') ||
                type.startsWith('audio/');
        });

        if (supportedFiles.length !== files.length) {
            alert('Only image, video, and audio files are supported');
        }

        setSelectedFiles(prev => [...prev, ...supportedFiles]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) return <FaImage className="w-3 h-3 text-white" />;
        if (fileType.startsWith('video/')) return <FaVideo className="w-3 h-3 text-white" />;
        if (fileType.startsWith('audio/')) return <MdAudioFile className="w-3 h-3 text-white" />;
        return <FaImage className="w-3 h-3" />;
    };

    // Audio recording functions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
                setSelectedFiles(prev => [...prev, audioFile]);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            const interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
            setRecordingInterval(interval);
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Unable to access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(recordingInterval);
            setRecordingTime(0);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    // Enhanced handle request with file support
    const handleRequestWithFiles = async () => {
        hasSaved.current = false;
        if (!message.trim() && selectedFiles.length === 0) return;

        try {
            const fileContents = await Promise.all(
                selectedFiles.map(async (file) => ({
                    inline_data: {
                        mime_type: file.type,
                        data: await fileToBase64(file)
                    }
                }))
            );

            const parts = [];
            if (message.trim()) {
                parts.push({ text: message.trim() });
            }
            parts.push(...fileContents);
            setSelectedFiles([]);
            handleRequest(parts);
        } catch (error) {
            console.error('Error processing files:', error);
            alert('Error processing files. Please try again.');
        }
    };

    return (
        <div className="sticky bottom-0 z-40 bg-zinc-900 w-full">
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="max-w-[90vw] sm:max-w-[80vw] md:max-w-2xl lg:max-w-3xl mx-auto px-4">
                {selectedFiles.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 bg-zinc-700 rounded-lg px-3 py-1 text-sm">
                                {getFileIcon(file.type)}
                                <span className="text-white truncate max-w-32">{file.name}</span>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="text-zinc-400 hover:text-white ml-2 text-2xl hover:cursor-pointer"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {isRecording && (
                    <div className="mb-3 flex sm:hidden items-center gap-2 bg-red-600/20 border border-red-600 rounded-lg px-3 py-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400 text-sm">Recording: {formatTime(recordingTime)}</span>
                        <button
                            onClick={stopRecording}
                            className="ml-auto p-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                        >
                            <FaStop className="w-3 h-3 text-white" />
                        </button>
                    </div>
                )}

                <div className="bg-zinc-800 rounded-2xl px-3 py-2 shadow-lg border border-zinc-700 hover:border-zinc-600 transition-colors duration-200 select-none">
                    <div className="hidden sm:block">
                        <div className="relative">
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleRequestWithFiles();
                                    }
                                }}
                                onChange={handleChange}
                                placeholder={isRecording ? "Listening..." : "Ask Thundr anything..."}
                                rows={1}
                                className="w-full bg-transparent text-white outline-none resize-none px-4 py-3 placeholder:text-zinc-400 text-sm sm:text-base max-h-32 overflow-y-auto leading-6 placeholder:truncate"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-700">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 group cursor-pointer relative" onClick={handleFileSelect}>
                                    <div className="shrink-0 p-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200">
                                        <IoAdd className="w-4 h-4 text-white sm:w-5 sm:h-5 transition-opacity shrink-0" />
                                    </div>
                                    <span className="text-zinc-300 text-sm sm:text-base font-medium group-hover:text-zinc-200 transition-colors">
                                        Upload files
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        className={`p-2 sm:p-2.5 rounded-lg transition-colors duration-200 cursor-pointer shrink-0 ${isRecording
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-zinc-700 hover:bg-zinc-600'
                                            }`}
                                    >
                                        {isRecording ? (
                                            <FaStop className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        ) : (
                                            <FaMicrophone className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-300 group-hover:text-white transition-colors" />
                                        )}
                                    </button>
                                    <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        <div className="bg-zinc-700 text-white text-xs sm:text-sm rounded-lg py-1 px-3 whitespace-nowrap shadow-lg">
                                            {isRecording ? 'Stop recording' : 'Record audio'}
                                        </div>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <button
                                        onClick={handleRequestWithFiles}
                                        className="p-2 sm:p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-default shrink-0"
                                        disabled={!message.trim() && selectedFiles.length === 0}
                                    >
                                        <IoSendSharp className="w-3 h-3 sm:w-4 sm:h-4 text-white shrink-0" />
                                    </button>
                                    <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        <div className="bg-zinc-700 text-white text-xs sm:text-sm rounded-lg py-1 px-3 whitespace-nowrap shadow-lg">
                                            Send message
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout (below sm) */}
                    <div className="sm:hidden">
                        <div className="flex items-end gap-2">
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="p-2 mb-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200 cursor-pointer shrink-0"
                                >
                                    <IoAdd className="w-4 h-4 text-white" />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute bottom-full mb-2 left-0 bg-zinc-700 rounded-lg shadow-lg border border-zinc-600 overflow-hidden">
                                        <button
                                            onClick={handleFileSelect}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-600 transition-colors text-left"
                                        >
                                            <FaImage className="w-4 h-4 opacity-60 text-white" />
                                            <span className="text-zinc-300 text-sm whitespace-nowrap">Upload files</span>
                                        </button>
                                        <button
                                            onClick={isRecording ? stopRecording : startRecording}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-600 transition-colors text-left border-t border-zinc-600"
                                        >
                                            {isRecording ? (
                                                <>
                                                    <FaStop className="w-4 h-4 text-red-400" />
                                                    <span className="text-red-400 text-sm whitespace-nowrap">Stop recording</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaMicrophone className="w-4 h-4 text-zinc-300" />
                                                    <span className="text-zinc-300 text-sm whitespace-nowrap">Record audio</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    ref={textareaRef}
                                    value={message}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleRequestWithFiles();
                                        }
                                    }}
                                    onChange={handleChange}
                                    placeholder={isRecording ? "Listening..." : "Ask Thundr anything..."}
                                    rows={1}
                                    className="w-full placeholder:truncate resize-none bg-transparent text-white outline-none px-3 py-2.5 placeholder:text-zinc-400 text-sm min-h-[44px] max-h-20 no-scrollbar"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingTop: '10px',
                                        paddingBottom: '10px'
                                    }}
                                />
                            </div>
                                <button
                                    onClick={handleRequestWithFiles}
                                    className="p-2.5 mb-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-default shrink-0"
                                    disabled={!message.trim() && selectedFiles.length === 0}
                                >
                                    <IoSendSharp className="w-4 h-4 text-white" />
                                </button>
                        </div>
                    </div>
                </div>
            </div>
            {chatHistory.length > 0 ? (
                <p className="text-xs sm:text-sm text-zinc-300 text-center py-2">
                    ThundrAI can make mistakes, so double-check it
                </p>
            ) : (
                <div className="py-3"></div>
            )}
        </div>
    );
}

export default Input;



