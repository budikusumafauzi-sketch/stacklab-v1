import { useState } from 'react';
import { ChevronRight, ChevronDown } from "../../config/icons";

export interface TreeViewerProps {
  data: unknown;
  name?: string;
  isLast?: boolean;
}

export function TreeViewer({ data, name, isLast = true }: TreeViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isObject = data !== null && typeof data === 'object' && !Array.isArray(data);
  const isArray = Array.isArray(data);
  const isComplex = isObject || isArray;

  const renderValue = () => {
    if (data === null) return <span className="text-gray-500 font-bold">null</span>;
    if (typeof data === 'string') return <span className="text-green-500 font-medium">"{data}"</span>;
    if (typeof data === 'number') return <span className="text-orange-400 font-medium">{data}</span>;
    if (typeof data === 'boolean') return <span className="text-blue-400 font-medium">{data ? 'true' : 'false'}</span>;
    
    if (isArray) return <span className="text-gray-500 italic">Array({(data as unknown[]).length})</span>;
    if (isObject) return <span className="text-gray-500 italic">Object</span>;
    
    return <span>{String(data)}</span>;
  };

  if (!isComplex) {
    return (
      <div className="flex items-start py-0.5 font-mono text-sm">
        <span className="w-4 inline-block"></span>
        {name && <span className="text-cyan-400 mr-1 font-medium">"{name}":</span>}
        {renderValue()}
        {!isLast && <span className="text-gray-500">,</span>}
      </div>
    );
  }

  const keys = Object.keys(data as Record<string, unknown>);
  const isEmpty = keys.length === 0;

  return (
    <div className="font-mono text-sm">
      <div 
        className="flex items-start py-0.5 cursor-pointer hover:bg-white/5 rounded px-1 -mx-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="w-4 inline-flex items-center justify-center text-gray-400 shrink-0">
          {!isEmpty && (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)}
        </span>
        {name && <span className="text-cyan-400 mr-1 font-medium">"{name}":</span>}
        <span className="text-gray-400 font-bold">{isArray ? '[' : '{'}</span>
        {!isExpanded && !isEmpty && (
          <>
            <span className="text-gray-500 mx-2 italic">{isArray ? `${keys.length} items` : `${keys.length} keys`}</span>
            <span className="text-gray-400 font-bold">{isArray ? ']' : '}'}</span>
            {!isLast && <span className="text-gray-500">,</span>}
          </>
        )}
        {isEmpty && (
          <>
            <span className="text-gray-400 font-bold">{isArray ? ']' : '}'}</span>
            {!isLast && <span className="text-gray-500">,</span>}
          </>
        )}
      </div>
      
      {isExpanded && !isEmpty && (
        <div className="pl-4 border-l border-white/10 ml-2">
          {keys.map((key, index) => (
            <TreeViewer 
              key={key} 
              data={(data as Record<string, unknown>)[key]} 
              name={isArray ? undefined : key}
              isLast={index === keys.length - 1}
            />
          ))}
        </div>
      )}
      
      {isExpanded && !isEmpty && (
        <div className="flex items-start py-0.5">
          <span className="w-4 inline-block shrink-0"></span>
          <span className="text-gray-400 font-bold">{isArray ? ']' : '}'}</span>
          {!isLast && <span className="text-gray-500">,</span>}
        </div>
      )}
    </div>
  );
}
