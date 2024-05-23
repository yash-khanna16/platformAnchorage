import React, { useState } from 'react';


type SearchInputProps = {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    icon?: React.ReactNode;

  };
  

const SearchInput = ({value='' ,onChange=()=>{}, placeholder="Input", icon}:SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="text-sm">
      <div className="flex space-x-2 rounded-xl cursor-pointer items-center px-3 py-2 bg-[#E8EDF5]">
        <div
          className={`w-6 transition-all duration-300 ${
            isFocused ? "transform opacity-0 w-0 -translate-x-2" : "transform opacity-100 translate-x-0"
          }`}
        >
         {icon}
        </div>
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-[#E8EDF5] focus:outline-none flex-grow"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchInput;
