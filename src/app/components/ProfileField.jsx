"use client";

const ProfileField = ({ label, value, onChange, disabled = false, type = "text" }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus:ring-gold-400"
        }`}
      />
    </div>
  );
};

export default ProfileField;
