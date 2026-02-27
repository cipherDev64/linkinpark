export default function SkeletonCard() {
    return (
        <div className="saas-card p-8 flex flex-col h-full bg-white animate-pulse">
            <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-border"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-slate-100 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-slate-50 rounded-lg w-1/2"></div>
                </div>
            </div>
            <div className="space-y-4 mb-8">
                <div className="h-4 bg-slate-50 rounded-lg w-full"></div>
                <div className="h-4 bg-slate-50 rounded-lg w-5/6"></div>
                <div className="h-4 bg-slate-50 rounded-lg w-3/4"></div>
            </div>
            <div className="mt-auto pt-8 border-t border-border flex items-center justify-between">
                <div className="h-5 bg-slate-100 rounded-lg w-16"></div>
                <div className="h-10 bg-slate-100 rounded-xl w-28"></div>
            </div>
        </div>
    );
}
