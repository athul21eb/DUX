"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";

const MentorSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const router = useTransitionRouter();

  // Validation function
  const validateInput = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 3) {
      setError("Enter at least 3 characters.");
    } else {
      setError(""); // Clear error if valid
    }
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery || trimmedQuery.length < 3) {
      setError("Enter at least 3 characters.");
      return;
    }

    setError(""); // Clear error before searching
    const searchURL = `mentors?search=${encodeURIComponent(trimmedQuery)}`;
    router.push(searchURL);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Mentor name or keyword"
          className={`pl-10 h-12 rounded-md ${error ? "border-red-500" : ""}`}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            validateInput(e.target.value); // Validate while typing
          }}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <Button
        size="lg"
        className="h-12"
        onClick={handleSearch}
        disabled={!!error || searchQuery.trim().length < 3}
      >
        Search
      </Button>
    </div>
  );
};

export default MentorSearch;
