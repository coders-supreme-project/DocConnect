import React, { useState, useEffect, useCallback } from "react";

export interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  onSelectLocation: (result: SearchResult) => void;
  initialValue?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelectLocation, initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<SearchResult[]>([]);

  // Debounce function to limit API calls
  const debounce = (func: Function, wait: number) => {
    let timeout: number;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func(...args), wait);
    };
  };

  // Fetch locations from OpenStreetMap API
  const searchLocation = async (input: string) => {
    if (input.length < 3) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error searching for location:", error);
    }
  };

  const debouncedSearch = useCallback(debounce(searchLocation, 300), []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleSelectLocation = (result: SearchResult) => {
    setQuery(result.display_name);
    setResults([]);
    onSelectLocation(result);
  };

  // Styles for list items
  const listItemStyle: React.CSSProperties = {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "10px", margin: "10px 0" }}
      />
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {results.map((result) => (
          <div
            key={result.place_id}
            onClick={() => handleSelectLocation(result)}
            style={listItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
          >
            {result.display_name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSearch;
