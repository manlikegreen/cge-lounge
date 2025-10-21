const PhoneIcon = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Classic Handset Shape */}
      <path d="M3 5c2-2 5-2 7 0l2 2c2 2 2 5 0 7l-2 2c-2 2-5 2-7 0l-2-2c-2-2-2-5 0-7l2-2z" />
      {/* Rotary Dial Base */}
      <circle cx="12" cy="15" r="3" />
      {/* Cord (Optional for the aesthetic) */}
      <path d="M14 17c2 2 4 4 4 6" />
    </svg>
  );
};

export default PhoneIcon;
