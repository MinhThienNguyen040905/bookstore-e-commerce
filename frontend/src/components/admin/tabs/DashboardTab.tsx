// src/components/admin/tabs/DashboardTab.tsx
import { DollarSign, UserPlus, FileText, BookOpen } from 'lucide-react';

export function DashboardTab() {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-display text-stone-900">Dashboard Overview</h2>
                <button className="px-4 py-2 bg-[#0df2d7] text-stone-900 rounded-lg text-sm font-bold shadow-sm hover:bg-[#00dcc3] transition-colors">
                    Download Report
                </button>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Sales"
                    value="$12,450"
                    trend="+12%"
                    icon={<DollarSign className="w-6 h-6 text-green-700" />}
                    bgIcon="bg-green-100"
                    trendColor="text-green-700 bg-green-50"
                />
                <StatCard
                    title="New Users"
                    value="1,200"
                    trend="+5%"
                    icon={<UserPlus className="w-6 h-6 text-blue-700" />}
                    bgIcon="bg-blue-100"
                    trendColor="text-blue-700 bg-blue-50"
                />
                <StatCard
                    title="Pending Orders"
                    value="45"
                    trend="-2%"
                    icon={<FileText className="w-6 h-6 text-orange-700" />}
                    bgIcon="bg-orange-100"
                    trendColor="text-red-700 bg-red-50"
                />
                <StatCard
                    title="Books"
                    value="3,405"
                    trend="Stable"
                    icon={<BookOpen className="w-6 h-6 text-[#009b8f]" />}
                    bgIcon="bg-[#0df2d7]/20"
                    trendColor="text-stone-600 bg-stone-100"
                />
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h3 className="text-stone-900 font-bold">Revenue</h3>
                            <p className="text-stone-500 text-sm">Monthly Overview</p>
                        </div>
                        <div className="text-right">
                            <p className="text-stone-900 text-2xl font-bold leading-none">$150k</p>
                            <p className="text-green-600 text-sm font-medium mt-1">+15% vs last month</p>
                        </div>
                    </div>
                    {/* Chart SVG Placeholder */}
                    <div className="w-full h-[240px] bg-stone-50 rounded flex items-center justify-center text-stone-400 border border-dashed border-stone-200">
                        [Chart Visualization Here]
                    </div>
                </div>

                {/* Categories Chart */}
                <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h3 className="text-stone-900 font-bold mb-6">Top Categories</h3>
                    <div className="flex flex-col gap-5">
                        <CategoryBar label="Fiction" percent="45%" color="bg-[#0df2d7]" width="45%" />
                        <CategoryBar label="Sci-Fi" percent="25%" color="bg-[#0df2d7]/80" width="25%" />
                        <CategoryBar label="Biography" percent="15%" color="bg-[#0df2d7]/60" width="15%" />
                        <CategoryBar label="History" percent="10%" color="bg-[#0df2d7]/40" width="10%" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components cho Dashboard
function StatCard({ title, value, trend, icon, bgIcon, trendColor }: any) {
    return (
        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white border border-stone-200 shadow-sm">
            <div className="flex justify-between items-start">
                <div className={`p-2 ${bgIcon} rounded-lg`}>{icon}</div>
                <span className={`${trendColor} px-2 py-0.5 rounded-full text-xs font-bold`}>{trend}</span>
            </div>
            <div>
                <p className="text-stone-500 text-sm font-medium mt-2">{title}</p>
                <p className="text-stone-900 text-2xl font-bold tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function CategoryBar({ label, percent, color, width }: any) {
    return (
        <div className="group">
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-stone-700">{label}</span>
                <span className="text-stone-500">{percent}</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${color}`} style={{ width: width }}></div>
            </div>
        </div>
    );
}