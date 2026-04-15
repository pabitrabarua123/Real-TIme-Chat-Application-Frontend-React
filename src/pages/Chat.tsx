import { useState, useRef, useEffect, KeyboardEvent, useContext } from "react";
import { socket } from "./socket";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Signout from "../components/Signout";

interface User {
  _id: string;
  name: string;
}

interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: string;
}

// User Sub-Component
function UserItem({ user, isSelected, onSelect }: { user: User; isSelected: boolean; onSelect: (user: User) => void }) {
  return (
    <div
      onClick={() => onSelect(user)}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 ${
        isSelected ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
    >
      <div className="relative flex-shrink-0">
        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=#fff`} className="w-9 h-9 rounded-full" />
        <span className="w-4 h-4 rounded-l bg-gray-300"></span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className="font-medium text-sm truncate">{user.name}</span>
        </div>
      </div>
    </div>
  );
}

// function TypingIndicator() {
//   return (
//     <div className="flex justify-start">
//       <div className="bg-white px-3 py-2 rounded-lg shadow-sm flex gap-1 items-center">
//         {([0, 0.2, 0.4] as number[]).map((delay, i) => (
//           <span
//             key={i}
//             className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
//             style={{ animationDelay: `${delay}s` }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// Main component 
export default function Chat() {

  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    console.log("Chat page useEffect called with user:", user, "and loading:", loading);
    if (!loading && !user) {
       navigate("/signin");
    }
  }, [loading, user, navigate]);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const selectedUserRef = useRef<User | null>(null);

  // Fetch users list left side bar
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:5000/api/user");
      const data = await res.json();
      setUsers(data.filter((u: User) => u._id !== user?._id));
    };

    fetchUsers();
  }, []);

  // keep selected user ref updated
  useEffect(() => {
    selectedUserRef.current = selectedUser;
    setMessages([]); // Clear messages when switching users

  }, [selectedUser]);

  // Socket listeners for incoming messages
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("register", user?._id);

    socket.on("receiveMessage", (message: Message) => {
      const activeUser = selectedUserRef.current;

      if (
        activeUser &&
        (message.senderId === activeUser._id ||
          message.receiverId === activeUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Load messages when user selected
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:5000/api/message/${user?._id}/${selectedUser._id}`);
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, [selectedUser]);

  // Send message function
  const sendMessage = () => {
    if (!text.trim() || !selectedUser || !user?._id) return;

    const message: Message = {
      senderId: user?._id,
      receiverId: selectedUser._id,
      text,
    };

    socket.emit("sendMessage", message);
    setText("");
  };

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") sendMessage();
  }

  if (loading) return <div>Loading...</div>;
  if (!user) return null

  return (
    <div className="flex h-screen bg-[#e5ddd5]">

      {/* Sidebar */}
      <div className="w-[280px] bg-white flex flex-col border-r border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gray-100">
          <span className="font-semibold text-base">Chats</span>
          <div className="flex gap-4 text-gray-500 text-lg cursor-pointer">
            <span title="New chat">+</span>
            <span title="Menu">⋮</span>
          </div>
        </div>

        {/* Search */}
        {/* <div className="px-3 py-2 bg-gray-50 border-b">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search or start new chat"
              className="w-full pl-7 pr-3 py-1.5 bg-white rounded-full text-xs outline-none border border-gray-200 placeholder-gray-400"
            />
          </div>
        </div> */}

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {users?.filter(u => u._id !== user?._id).map(u => (
            <UserItem
              key={u._id}
              user={u}
              isSelected={selectedUser?._id === u._id}
              onSelect={setSelectedUser}
            />
          ))}

        </div>
      </div>

      {/* ── Chat Section ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={`https://ui-avatars.com/api/?name=${selectedUser?.name}&background=random&color=#fff`} className="w-9 h-9 rounded-full" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="font-medium text-sm">{selectedUser?.name}</div>
            </div>
          </div>
          <div className="flex gap-5 text-gray-500 text-lg cursor-pointer">
            <Signout />
            <span title="More options">⋮</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {messages.length === 0 && (
            <div className="text-center text-xs text-gray-400 mt-10">
              No messages yet. Say hello! 👋
            </div>
          )}
          {messages.map((msg, i) => {
            const isOut = msg.senderId === user?._id;
            return (
              <div key={msg._id}>
                {i === 0 && (
                  <div className="flex justify-center my-2">
                    <span className="bg-blue-50 text-gray-500 text-[10px] px-3 py-0.5 rounded-lg">
                      TODAY
                    </span>
                  </div>
                )}
                <div className={`flex ${isOut ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-1.5 text-sm rounded-lg max-w-[65%] shadow-sm ${
                    isOut ? "bg-[#dcf8c6] rounded-br-sm" : "bg-white rounded-bl-sm"
                  }`}>
                    <div className="text-gray-900 leading-snug">{msg.text}</div>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span className="text-[10px] text-gray-400">
                        {new Date(msg.createdAt || new Date()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input bar */}
        <div className="px-3 py-2 bg-gray-100 flex items-center gap-2 border-t border-gray-200">
          <button className="text-gray-500 text-xl" title="Emoji">🙂</button>
          <button className="text-gray-500 text-xl" title="Attach">📎</button>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 bg-white rounded-full text-sm outline-none"
          />
          <button className="text-gray-500 text-xl" title="Voice note">🎤</button>
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ➤
          </button>
        </div>

      </div>
    </div>
  );
}