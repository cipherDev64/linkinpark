import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeamById, getTeamTasks, addTaskToTeam, updateTaskStatus } from "../services/teamService";
import { getUserById } from "../services/userService";
import { Plus, GripVertical } from "lucide-react";

export default function ProjectRoom() {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Project Room...</div>;
    if (!team) return <div className="p-12 text-center text-red-500 font-bold">Room not found.</div>;

    const todoTasks = tasks.filter(t => t.status === "todo");
    const doingTasks = tasks.filter(t => t.status === "doing");
    const doneTasks = tasks.filter(t => t.status === "done");

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-display font-black text-slate-900 mb-2">{team.name}</h1>
                    <p className="text-slate-500 font-bold">{team.description}</p>
                </div>

                <div className="flex -space-x-3">
                    {members.map(m => (
                        <div key={m.uid} className="w-10 h-10 rounded-full bg-blue-100 border-2 border-slate-800 shadow-[2px_2px_0px_#1e293b] flex items-center justify-center text-sm font-black text-slate-800 z-10" title={m.displayName}>
                            {m.displayName?.charAt(0)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pb-4">

                {/* TODO Column */}
                <div className="doodle-card bg-[#f1f5f9] p-4 flex flex-col h-full border-dashed">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center justify-between border-b-2 border-slate-300 pb-2">
                        To Do <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-sm">{todoTasks.length}</span>
                    </h3>

                    <form onSubmit={handleAddTask} className="mb-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add a task..."
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
                <div className="doodle-card bg-[#eff6ff] p-4 flex flex-col h-full border-dashed border-blue-300">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center justify-between border-b-2 border-blue-200 pb-2 text-blue-900">
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
                <div className="doodle-card bg-[#f0fdf4] p-4 flex flex-col h-full border-dashed border-green-300">
                    <h3 className="text-lg font-display font-bold mb-4 flex items-center justify-between border-b-2 border-green-200 pb-2 text-green-900">
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
        </div>
    );
}

function TaskCard({ task, onMove }) {
    let color = "bg-white";
    if (task.status === "doing") color = "bg-blue-50";
    if (task.status === "done") color = "bg-green-50 opacity-60";

    return (
        <div className={`border-2 border-slate-800 rounded-xl p-4 shadow-[2px_2px_0px_#1e293b] group hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1e293b] transition-all ${color}`}>
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
