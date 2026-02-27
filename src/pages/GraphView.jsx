import { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { getAllUsers } from "../services/userService";
import { getCurrentUser } from "../services/authService";
import { generateGraphData } from "../services/graphService";
import { calculateCompatibility } from "../services/matchService";

export default function GraphView() {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const allUsers = await getAllUsers();
            const currentAuth = getCurrentUser();
            const current = allUsers.find(u => u.uid === currentAuth?.uid) || null;

            setCurrentUser(current);
            setGraphData(generateGraphData(allUsers, current));
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight
            });
        }
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleNodeClick = (node) => {
        if (node.isCurrentUser) return;
        const score = currentUser ? calculateCompatibility(currentUser, node.user) : 0;
        setSelectedNode({ user: node.user, score });
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Campus <span className="neon-text-blue">Graph</span></h1>
                <p className="text-gray-400">Visualize skill connections across NHCE. Nodes are users, links are shared skills.</p>
            </div>

            <div className="flex-1 relative glass-card overflow-hidden" ref={containerRef}>
                {graphData.nodes.length > 0 && (
                    <ForceGraph2D
                        width={dimensions.width}
                        height={dimensions.height}
                        graphData={graphData}
                        nodeLabel="label"
                        nodeColor="color"
                        nodeVal="val"
                        linkColor={() => "rgba(255,255,255,0.1)"}
                        linkWidth={link => link.sharedSkills > 2 ? 3 : 1}
                        onNodeClick={handleNodeClick}
                        backgroundColor="transparent"
                        nodeRelSize={4}
                        enableZoomPanInteraction={true}
                    />
                )}

                {selectedNode && (
                    <div className="absolute top-4 right-4 w-80 glass-card p-6 border-neonBlue/50 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">{selectedNode.user.name}</h3>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="text-gray-400 hover:text-white"
                            >×</button>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">{selectedNode.user.department}</p>

                        <div className="mb-4">
                            <div className="text-sm text-gray-500 mb-1">Compatibility</div>
                            <div className="text-3xl font-black neon-text-pink">{selectedNode.score}%</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(selectedNode.user.skills || []).slice(0, 5).map(s => (
                                <span key={s} className="text-xs px-2 py-1 bg-white/5 rounded-full border border-white/10 text-gray-300">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
