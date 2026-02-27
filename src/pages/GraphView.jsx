import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getAllUsers } from '../services/userService';
import { calculateCompatibility } from '../services/matchService';
import { getCurrentUser } from '../services/authService';
import { X, ExternalLink, Activity, MessageCircle, Github, Linkedin, Globe, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function GraphView() {
    const graphRef = useRef();
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [selectedNode, setSelectedNode] = useState(null);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth - 288, height: window.innerHeight });
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const sidebarWidth = window.innerWidth >= 768 ? 288 : 0;
            setDimensions({
                width: window.innerWidth - sidebarWidth,
                height: window.innerHeight
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loadGraphData = async () => {
            const users = await getAllUsers();

            const nodes = users.map(user => ({
                id: user.uid,
                name: user.displayName,
                group: user.department || 'General',
                val: 8,
                ...user
            }));

            const links = [];
            for (let i = 0; i < users.length; i++) {
                for (let j = i + 1; j < users.length; j++) {
                    const { score } = calculateCompatibility(users[i], users[j]);
                    if (score >= 65) {
                        links.push({
                            source: users[i].uid,
                            target: users[j].uid,
                            value: score
                        });
                    }
                }
            }

            setGraphData({ nodes, links });
        };
        loadGraphData();
    }, []);

    const handleNodeClick = useCallback((node) => {
        const me = getCurrentUser();
        let matchInfo = null;
        if (me && node.uid !== me.uid) {
            const myNode = graphData.nodes.find(n => n.uid === me.uid);
            if (myNode) {
                matchInfo = calculateCompatibility(myNode, node);
            }
        }
        setSelectedNode({ ...node, matchInfo });
        graphRef.current?.centerAt(node.x, node.y, 800);
        graphRef.current?.zoom(3.5, 1000);
    }, [graphData]);

    const nodeColors = useMemo(() => {
        const colors = ['#7C3AED', '#F43F5E', '#10B981', '#F59E0B', '#3B82F6', '#EC4899'];
        let mapping = {};
        let idx = 0;
        return (group) => {
            if (!mapping[group]) {
                mapping[group] = colors[idx % colors.length];
                idx++;
            }
            return mapping[group];
        }
    }, []);

    return (
        <div className="relative w-full h-screen bg-bg overflow-hidden -m-10 max-w-[100vw]">
            {/* Dept Legend Overlay */}
            <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="absolute top-10 left-10 saas-card p-6 z-10 w-64 shadow-premium"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Target className="text-primary" size={18} />
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Campus Departments</h3>
                </div>
                <div className="flex flex-col gap-3">
                    {Array.from(new Set(graphData.nodes.map(n => n.group))).map(dept => (
                        <div key={dept} className="flex items-center gap-3 text-sm font-bold text-heading">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: nodeColors(dept) }}></div>
                            <span className="truncate">{dept}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}
                onNodeClick={handleNodeClick}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const color = nodeColors(node.group);

                    // Node Shadow/Glow
                    ctx.shadowBlur = 10 / globalScale;
                    ctx.shadowColor = color;

                    // Base circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
                    ctx.fillStyle = color;
                    ctx.fill();

                    ctx.shadowBlur = 0;
                    ctx.lineWidth = 2 / globalScale;
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.stroke();

                    // Name Tag
                    const textLabel = (node.name || 'User').split(' ')[0];
                    const fontSize = 4;
                    ctx.font = `bold ${fontSize}px "Outfit", sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Label Background
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    const textWidth = ctx.measureText(textLabel).width;
                    const padding = 2;
                    ctx.roundRect(node.x - textWidth / 2 - padding, node.y + 8, textWidth + padding * 2, 6, 2);
                    ctx.fill();

                    ctx.fillStyle = '#0F172A';
                    ctx.fillText(textLabel, node.x, node.y + 11);
                }}
                linkColor={() => '#E2E8F0'}
                linkWidth={link => link.value > 80 ? 1.5 : 0.4}
                linkCurvature={0.2}
                d3VelocityDecay={0.3}
            />

            {/* Selected Node Profile Sidebar Overlay */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="absolute top-0 right-0 h-full w-96 bg-surface shadow-premium z-20 border-l border-border flex flex-col"
                    >
                        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-border">
                                    <Target className="text-primary" size={24} />
                                </div>
                                <button
                                    onClick={() => setSelectedNode(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="text-center mb-8">
                                <div className="w-24 h-24 rounded-[32px] bg-primary/10 mx-auto mb-6 flex items-center justify-center text-4xl font-black text-primary border-4 border-surface shadow-premium">
                                    {(selectedNode.avatarConfig && selectedNode.avatarConfig.emoji) || (selectedNode.name ? selectedNode.name.charAt(0) : "N")}
                                </div>
                                <h2 className="text-2xl font-extrabold text-heading tracking-tight">{selectedNode.name || "Node User"}</h2>
                                <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">{selectedNode.department || 'NHCE Student'}</p>
                            </div>

                            {selectedNode.matchInfo && (
                                <div className="p-6 bg-primary-50 rounded-3xl border border-primary/10 mb-8 relative overflow-hidden group">
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Compatibility</p>
                                            <h4 className="text-3xl font-black text-primary">{selectedNode.matchInfo.score}%</h4>
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft text-primary">
                                            <Activity size={24} />
                                        </div>
                                    </div>
                                    <p className="relative z-10 text-xs font-semibold text-primary/70 mt-3 leading-relaxed">
                                        {selectedNode.matchInfo.explanation?.replace('Matched because: ', '') || 'Strong Skill Overlap'}
                                    </p>
                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 transition-transform" />
                                </div>
                            )}

                            <div className="space-y-8 text-left">
                                <div>
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">About Collaborator</h4>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                        "{selectedNode.bio || 'Exploring the network for exciting projects.'}"
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNode.skills?.map((skill, i) => (
                                            <span key={i} className="text-[11px] font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full border border-slate-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {(selectedNode.github || selectedNode.linkedin) && (
                                    <div className="flex gap-4">
                                        {selectedNode.github && <a href={selectedNode.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-100 transition-all"><Github size={18} /></a>}
                                        {selectedNode.linkedin && <a href={selectedNode.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary-50 transition-all"><Linkedin size={18} /></a>}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-8 border-t border-border">
                            <button
                                onClick={() => navigate(`/room/new?partner=${selectedNode.uid}`)}
                                className="w-full h-14 btn-primary"
                            >
                                <MessageCircle size={20} />
                                Start Collaboration
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
