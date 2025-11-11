import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    { value: "all", label: "All Topics", color: "bg-slate-100 text-slate-800" },
    { value: "politics", label: "Politics", color: "bg-red-100 text-red-800" },
    { value: "technology", label: "Technology", color: "bg-blue-100 text-blue-800" },
    { value: "science", label: "Science", color: "bg-green-100 text-green-800" },
    { value: "society", label: "Society", color: "bg-purple-100 text-purple-800" },
    { value: "culture", label: "Culture", color: "bg-pink-100 text-pink-800" },
    { value: "education", label: "Education", color: "bg-yellow-100 text-yellow-800" },
    { value: "environment", label: "Environment", color: "bg-emerald-100 text-emerald-800" },
    { value: "economics", label: "Economics", color: "bg-orange-100 text-orange-800" }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <Badge
          key={category.value}
          variant="secondary"
          className={`px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 ${
            selectedCategory === category.value
              ? "bg-slate-900 text-white shadow-md"
              : `${category.color} hover:shadow-sm`
          }`}
          onClick={() => onCategoryChange(category.value)}
        >
          {category.label}
        </Badge>
      ))}
    </div>
  );
}