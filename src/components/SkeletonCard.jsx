export default function SkeletonCard() {
    return (
        <div className="doodle-card p-6 flex flex-col h-full bg-white animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-300"></div>
                <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-slate-200 rounded-md w-full"></div>
                <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
            </div>
            <div className="mt-auto pt-4 border-t-2 border-slate-100 flex items-center justify-between">
                <div className="h-8 bg-slate-200 rounded-md w-12"></div>
                <div className="h-10 bg-slate-200 rounded-2xl w-24"></div>
            </div>
        </div>
    );
}
