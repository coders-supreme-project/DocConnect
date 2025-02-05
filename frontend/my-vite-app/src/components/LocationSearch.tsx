// import React, { useState, useEffect, useCallback } from 'react';
// import { TextField, List, ListItem, ListItemText } from '@mui/material';

// export interface SearchResult {
//   place_id: number;
//   display_name: string;
//   lat: string;
//   lon: string;
// }

// interface LocationSearchProps {
//   onSelectLocation: (result: SearchResult) => void;
//   initialValue?: string;
// }

// const LocationSearch: React.FC<LocationSearchProps> = ({ onSelectLocation, initialValue = '' }) => {
//   const [query, setQuery] = useState(initialValue);
//   const [results, setResults] = useState<SearchResult[]>([]);

//   // Custom debounce function
//   const debounce = (func, wait) => {
//     let timeout;
//     const debouncedFunction = (...args) => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => func(...args), wait);
//     };
//     debouncedFunction.cancel = () => clearTimeout(timeout); // Add cancel method
//     return debouncedFunction;
//   };

//   const searchLocation = async (input: string) => {
//     if (input.length < 3) return;
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`
//       );
//       const data = await response.json();
//       setResults(data);
//     } catch (error) {
//       console.error('Error searching for location:', error);
//     }
//   };

//   // Memoize the debounced search function
//   const debouncedSearch = useCallback(debounce(searchLocation, 300), []);

//   useEffect(() => {
//     debouncedSearch(query);
//     return () => {
//       debouncedSearch.cancel(); // Cancel the debounced function on cleanup
//     };
//   }, [query, debouncedSearch]);

//   const handleSelectLocation = (result: SearchResult) => {
//     setQuery(result.display_name);
//     setResults([]);
//     onSelectLocation(result);
//   };

//   return (
//     <div>
//       <TextField
//         fullWidth
//         label="Address"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         margin="normal"
//       />
//       <List>
//         {results.map((result) => (
//           <ListItem
//             key={result.place_id}
//             onClick={() => handleSelectLocation(result)}
//             sx={{ cursor: 'pointer' }}
//           >
//             <ListItemText primary={result.display_name} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );
// };

// export default LocationSearch;