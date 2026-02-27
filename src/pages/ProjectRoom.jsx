import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeamById, getTeamTasks, addTaskToTeam, updateTaskStatus } from "../services/teamService";
import { getUserById } from "../services/userService";
import { subscribeToRoomMessages, sendMessageToRoom } from "../services/chatService";
import { getCurrentUser } from "../services/authService";
import Avatar from "../components/Avatar";
import { Plus, GripVertical, Send, MessageSquare } from "lucide-react";

export default function ProjectRoom() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    // Chat state
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(true);

    const [loading, setLoading] = useState(true);
    const currentUser = getCurrentUser();

    useEffect(() => {
        const fetchRoomData = async () => {
            if (!id) return;
            const t = await getTeamById(id);
            if (t) {
                setTeam(t);
                // Fetch members
                const memData = await Promise.all((t.members || []).map(uid => getUserById(uid)));
                setMembers(memData.filter(Boolean));

                // Fetch tasks
                const tsks = await getTeamTasks(id);
                setTasks(tsks);
            }
            setLoading(false);
        };
        fetchRoomData();

        // Subscribe to chat
        const unsubscribeChat = subscribeToRoomMessages(id, (msgs) => {
            setMessages(msgs);
        });

        return () => unsubscribeChat();
    }, [id]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const payload = {
            title: newTaskTitle,
            status: "todo",
            assignee: null
        };

        const taskId = await addTaskToTeam(id, payload);
        setTasks([...tasks, { id: taskId, ...payload }]);
        setNewTaskTitle("");
    };

    const handleMoveTask = async (taskId, newStatus) => {
        await updateTaskStatus(id, taskId, newStatus);
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        // Find current user's full profile to get avatar config
        const fullUser = members.find(m => m.uid === currentUser.uid) || currentUser;

        try {
            await sendMessageToRoom(id, fullUser, newMessage);
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Project Room...</div>;
    if (!team) return <div className="p-12 text-center text-red-500 font-bold">Room not found.</div>;

    const todoTasks = tasks.filter(t => t.status === "todo");
    const doingTasks = tasks.filter(t => t.status === "doing");
    const doneTasks = tasks.filter(t => t.status === "done");

    return (
        <div className="max-w-[1400px] mx-auto h-full flex flex-col min-h-0">
            <div className="flex justify-between items-end mb-6 shrink-0 flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-display font-black text-slate-900 mb-2 flex items-center gap-4">
                        {team.name}
                        <button
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className="text-sm font-bold flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors"
                        >
                            <MessageSquare size={16} /> {isChatOpen ? 'Hide Chat' : 'Show Chat'}
                        </button>
                    </h1>
                    <p className="text-slate-500 font-bold">{team.description}</p>
                </div>

                <div className="flex -space-x-3">
                    {members.map(m => (
                        <div key={m.uid} className="relative z-10 hover:z-20 hover:scale-110 transition-transform cursor-pointer">
                            <Avatar user={m} config={m.avatarConfig} className="w-10 h-10 text-sm shadow-md" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area: Kanban + Chat */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden pb-4">

                {/* Kanban Board */}
                <div className={`flex-1 grid ${isChatOpen ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'} gap-6 overflow-y-auto lg:overflow-hidden`}>
                    {/* TODO Column */}
                    <div className="doodle-card bg-[#f1f5f9] p-4 flex flex-col h-full border-dashed hidden-scrollbar">
                        <h3 className="text-lg font-display font-bold mb-4 flex items-center justify-between border-b-2 border-slate-300 pb-2">
                            To Do <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-sm">{todoTasks.length}</span>
                        </h3>

                        <form onSubmit={handleAddTask} className="mb-4 shrink-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add task..."
                                    className="doodle-input py-2 text-sm flex-1"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                />
                                <button type="submit" className="btn-doodle px-3 py-2 bg-pink-100"><Plus size={16} /></button>
                            </div>
                        </form>

                        <div className="overflow-y-auto pr-2 space-y-3 flex-1 flex flex-col gap-3">
                            {todoTasks.map(t => (
                                <TaskCard key={t.id} task={t} onMove={(status) => handleMoveTask(t.id, status)} />
                            ))}
                        </div>
                    </div>

                    {/* DOING Column */}
                    <div className="doodle-card bg-[#eff6ff] p-4 flex flex-col h-full border-dashed border-blue-300 hidden-scrollbar">
                        <h3 className="text-lg font-display font-bold mb-4 flex items-center justify-between border-b-2 border-blue-200 pb-2 text-blue-900 shrink-0">
                            In Progress <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-sm">{doingTasks.length}</span>
                        </h3>
                        <div className="overflow-y-auto pr-2 flex-1 flex flex-col gap-3">
                            {doingTasks.map(t => (
                                <TaskCard key={t.id} task={t} onMove={(status) => handleMoveTask(t.id, status)} />
                            ))}
                            {doingTasks.length === 0 && <p className="text-sm font-bold text-blue-300 text-center mt-10">Drag tasks here</p>}
                        </div>
                    </div>

                    {/* DONE Column */}
                    <div className="doodle-card bg-[#f0fdf4] p-4 flex flex-col h-full border-dashed border-green-300 hidden-scrollbar">
                        <h3 className="text-lg font-display font-bold mb-4 flex items-center justify-between border-b-2 border-green-200 pb-2 text-green-900 shrink-0">
                            Done <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-sm">{doneTasks.length}</span>
                        </h3>
                        <div className="overflow-y-auto pr-2 flex-1 flex flex-col gap-3">
                            {doneTasks.map(t => (
                                <TaskCard key={t.id} task={t} onMove={(status) => handleMoveTask(t.id, status)} />
                            ))}
                            {doneTasks.length === 0 && <p className="text-sm font-bold text-green-300 text-center mt-10">Nothing completed yet</p>}
                        </div>
                    </div>
                </div>

                {/* Team Chat Panel */}
                {isChatOpen && (
                    <div className="w-full lg:w-80 xl:w-96 doodle-card bg-white flex flex-col h-[500px] lg:h-full border border-slate-200 shadow-sm shrink-0">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl shrink-0">
                            <h3 className="font-display font-bold text-slate-800 flex items-center gap-2">
                                <MessageSquare size={18} className="text-blue-500" /> Team Chat
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
                            {/* Messages reverse order so newest is at bottom */}
                            {[...messages].reverse().map(msg => {
                                const isMe = currentUser?.uid === msg.senderId;
                                return (
                                    <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className="shrink-0">
                                            <Avatar
                                                user={{ displayName: msg.senderName, email: msg.senderId }}
                                                config={msg.senderAvatarConfig}
                                                className="w-8 h-8 text-xs shadow-sm"
                                            />
                                        </div>
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                            <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                                                {isMe ? 'You' : msg.senderName.split(' ')[0]}
                                            </span>
                                            <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {messages.length === 0 && (
                                <div className="text-center text-slate-400 font-bold text-sm my-auto">
                                    No messages yet.<br />Say hello to your team! 👋
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl shrink-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="doodle-input py-2 text-sm flex-1 bg-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="btn-doodle p-2 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 text-blue-700"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

function TaskCard({ task, onMove }) {
    let color = "bg-white";
    if (task.status === "doing") color = "bg-blue-50";
    if (task.status === "done") color = "bg-green-50 opacity-60";

    return (
        <div className={`border border-slate-200 rounded-xl p-4 shadow-sm group hover:-translate-y-1 hover:shadow-md transition-all ${color}`}>
            <div className="flex items-start gap-2">
                <GripVertical size={16} className="text-slate-400 mt-1 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                <p className={`text-sm font-bold text-slate-800 ${task.status === 'done' ? 'line-through text-slate-500' : ''}`}>
                    {task.title}
                </p>
            </div>

            <div className="mt-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                {task.status !== 'todo' && <button onClick={() => onMove('todo')} className="text-xs font-bold text-slate-500 hover:text-slate-900 border-2 border-slate-300 rounded px-2">To Do</button>}
                {task.status !== 'doing' && <button onClick={() => onMove('doing')} className="text-xs font-bold text-blue-600 hover:text-blue-800 border-2 border-blue-300 bg-blue-100 rounded px-2">Doing</button>}
                {task.status !== 'done' && <button onClick={() => onMove('done')} className="text-xs font-bold text-green-600 hover:text-green-800 border-2 border-green-300 bg-green-100 rounded px-2">Done</button>}
            </div>
        </div>
    )
}
