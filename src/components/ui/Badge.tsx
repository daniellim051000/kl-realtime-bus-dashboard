"use client";

interface BadgeProps {
  count: number;
}

export default function Badge({ count }: BadgeProps) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
        0
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
      {count}
    </span>
  );
}
