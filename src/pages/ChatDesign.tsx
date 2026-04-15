import { useState, useRef, useEffect, KeyboardEvent } from "react";

// ── Types ──────────────────────────────────────────────
interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  unread: number;
  lastMsg: string;
  time: string;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
}

type MessagesMap = Record<number, Message[]>;

// ── Static data ────────────────────────────────────────
const USERS: User[] = [
  { id: 1, name: "Priya Sharma",  avatar: "https://i.pravatar.cc/40?img=12", status: "online",  online: true,  unread: 0, lastMsg: "okay see you tomorrow!",       time: "10:32" },
  { id: 2, name: "Rahul Dev",     avatar: "https://i.pravatar.cc/40?img=5",  status: "offline", online: false, unread: 3, lastMsg: "can you send that doc again?", time: "9:14"  },
  { id: 3, name: "Meera Nair",    avatar: "https://i.pravatar.cc/40?img=47", status: "online",  online: true,  unread: 0, lastMsg: "Thanks for the help!",         time: "Yesterday" },
  { id: 4, name: "Arjun Kapoor",  avatar: "https://i.pravatar.cc/40?img=33", status: "offline", online: false, unread: 1, lastMsg: "alright, I'll check it out",   time: "Mon" },
];

const INITIAL_MESSAGES: MessagesMap = {
  1: [
    { id: 1, senderId: 1, text: "Hey! Are you free tomorrow evening?", time: "10:21", status: "read" },
    { id: 2, senderId: 0, text: "Yeah, I think so. What's up?",        time: "10:23", status: "read" },
    { id: 3, senderId: 1, text: "Was thinking we could catch up!",     time: "10:24", status: "read" },
    { id: 4, senderId: 0, text: "Sounds good! Dinner somewhere?",      time: "10:28", status: "delivered" },
  ],
  2: [], 3: [], 4: [],
};

// ── Sub-components ─────────────────────────────────────
function TickIcon({ status }: { status: Message["status"] }) {
  if (status === "sent")      return <span className="text-[10px] text-gray-400">✓</span>;
  if (status === "delivered") return <span className="text-[10px] text-gray-400">✓✓</span>;
  if (status === "read")      return <span className="text-[10px] text-blue-400">✓✓</span>;
  return null;
}

interface UserItemProps {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
}

function UserItem({ user, isSelected, onSelect }: UserItemProps) {
  return (
    <div
      onClick={() => onSelect(user)}
      className={`flex items-center gap-3 px-3 py-2 cursor-pointer border-b border-gray-50 ${
        isSelected ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
    >
      <div className="relative flex-shrink-0">
        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
        {user.online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className="font-medium text-sm truncate">{user.name}</span>
          <span className={`text-[10px] ml-2 flex-shrink-0 ${user.unread ? "text-green-500" : "text-gray-400"}`}>
            {user.time}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-gray-500 truncate">{user.lastMsg}</span>
          {user.unread > 0 && (
            <span className="ml-2 flex-shrink-0 bg-green-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
              {user.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white px-3 py-2 rounded-lg shadow-sm flex gap-1 items-center">
        {([0, 0.2, 0.4] as number[]).map((delay, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────
export default function ChatDesign() {
  const [users, setUsers]               = useState<User[]>(USERS);
  const [selectedUser, setSelectedUser] = useState<User>(USERS[0]);
  const [messages, setMessages]         = useState<MessagesMap>(INITIAL_MESSAGES);
  const [input, setInput]               = useState<string>("");
  const [search, setSearch]             = useState<string>("");
  const [isTyping, setIsTyping]         = useState<boolean>(false);
  const messagesEndRef                  = useRef<HTMLDivElement>(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  function sendMessage(): void {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      senderId: 0,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] ?? []), newMsg],
    }));
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: Date.now() + 1,
        senderId: selectedUser.id,
        text: "Got it! 👍",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read",
      };
      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] ?? []), reply],
      }));
    }, 1500);
  }

  function selectUser(user: User): void {
    setSelectedUser(user);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") sendMessage();
  }

  const currentMessages: Message[] = messages[selectedUser.id] ?? [];

  return (
    <div className="flex h-screen bg-[#e5ddd5]">

      {/* ── Sidebar ── */}
      <div className="w-[280px] bg-white flex flex-col border-r border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
          <span className="font-semibold text-base">Chats</span>
          <div className="flex gap-4 text-gray-500 text-lg cursor-pointer">
            <span title="New chat">+</span>
            <span title="Menu">⋮</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 bg-gray-50 border-b">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search or start new chat"
              className="w-full pl-7 pr-3 py-1.5 bg-white rounded-full text-xs outline-none border border-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 && (
            <div className="text-xs text-gray-400 text-center mt-6">No chats found</div>
          )}
          {filteredUsers.map(user => (
            <UserItem
              key={user.id}
              user={user}
              isSelected={selectedUser.id === user.id}
              onSelect={selectUser}
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
              <img src={selectedUser.avatar} className="w-9 h-9 rounded-full" />
              {selectedUser.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <div className="font-medium text-sm">{selectedUser.name}</div>
              <div className={`text-xs ${selectedUser.online ? "text-green-500" : "text-gray-400"}`}>
                {isTyping ? "typing..." : selectedUser.status}
              </div>
            </div>
          </div>
          <div className="flex gap-5 text-gray-500 text-lg cursor-pointer">
            <span title="Voice call">📞</span>
            <span title="Video call">🎥</span>
            <span title="Search messages">🔍</span>
            <span title="More options">⋮</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {currentMessages.length === 0 && (
            <div className="text-center text-xs text-gray-400 mt-10">
              No messages yet. Say hello! 👋
            </div>
          )}
          {currentMessages.map((msg, i) => {
            const isOut = msg.senderId === 0;
            return (
              <div key={msg.id}>
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
                      <span className="text-[10px] text-gray-400">{msg.time}</span>
                      {isOut && <TickIcon status={msg.status} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="px-3 py-2 bg-gray-100 flex items-center gap-2 border-t border-gray-200">
          <button className="text-gray-500 text-xl" title="Emoji">🙂</button>
          <button className="text-gray-500 text-xl" title="Attach">📎</button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 bg-white rounded-full text-sm outline-none"
          />
          <button className="text-gray-500 text-xl" title="Voice note">🎤</button>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ➤
          </button>
        </div>

      </div>
    </div>
  );
}