import React, { useState, createContext, useContext } from 'react';

// Create context for tabs state
interface TabsContextType {
  selectedValue: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = ({ 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  ...props 
}: TabsProps) => {
  const [selectedValueState, setSelectedValueState] = useState(defaultValue);
  
  // Use controlled or uncontrolled value
  const selectedValue = value !== undefined ? value : selectedValueState;
  
  const onChange = (newValue: string) => {
    if (value === undefined) {
      setSelectedValueState(newValue);
    }
    onValueChange?.(newValue);
  };
  
  return (
    <TabsContext.Provider value={{ selectedValue, onChange }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = ({ className = '', children, ...props }: TabsListProps) => {
  return (
    <div 
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = ({ className = '', value, children, ...props }: TabsTriggerProps) => {
  const { selectedValue, onChange } = useTabs();
  const isSelected = selectedValue === value;
  
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
        isSelected
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-900"
      } ${className}`}
      onClick={() => onChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = ({ className = '', value, children, ...props }: TabsContentProps) => {
  const { selectedValue } = useTabs();
  
  if (value !== selectedValue) {
    return null;
  }
  
  return (
    <div className={`mt-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };