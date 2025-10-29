import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color = "var(--brand-bg)",
}) => {
  return (
    <div className="bg-[#0b1018] border border-foreground/20 rounded-lg p-6 flex flex-col justify-center items-center min-h-[120px] backdrop-blur">
      <p className="text-sm text-foreground/70 mb-2 text-center font-medium">
        {label}
      </p>
      <p className="text-3xl font-bold text-center" style={{ color }}>
        {value}
      </p>
    </div>
  );
};

const Stats: React.FC = () => {
  return (
    <div className="bg-background p-6 rounded-xl backdrop-blur container mx-auto">
      {/* Title */}
      <h2 className="text-5xl font-bold text-brand-bg mb-12">
        Quick <span className="text-brand-alt">Stats</span>
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Users"
          value="2,847"
          color="#fbbf24" // amber-400 for contrast
        />
        <StatCard
          label="Live Tournaments"
          value="3"
          color="#f97316" // orange-500 for contrast
        />
        <StatCard
          label="Total Revenue"
          value="$15,500"
          color="var(--brand-bg)"
        />
        <StatCard
          label="This Month's Winners"
          value="24"
          color="var(--brand-bg)"
        />
      </div>
    </div>
  );
};

export default Stats;
