import { ActivityCategory, ActivityType } from "../../../services/activity/dispatcher";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Search } from "lucide-react";

interface ActivityFilterProps {
  onTypeChange: (type?: ActivityType) => void;
  onCategoryChange: (category?: ActivityCategory) => void;
  onSearchChange: (search?: string) => void;
  currentType?: ActivityType;
  currentCategory?: ActivityCategory;
  currentSearch?: string;
}

export function ActivityFilter({
  onTypeChange,
  onCategoryChange,
  onSearchChange,
  currentType,
  currentCategory,
  currentSearch
}: ActivityFilterProps) {
  return (
    <div className="flex flex-col space-y-4 p-4 border-b bg-muted/20">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search activities..." 
          className="pl-9"
          value={currentSearch || ""}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex flex-col gap-2 min-w-fit">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</span>
          <div className="flex gap-2">
            <Button 
              variant={!currentType ? "secondary" : "outline"} 
              size="sm"
              onClick={() => onTypeChange(undefined)}
            >
              All
            </Button>
            {Object.values(ActivityType).map(type => (
              <Button
                key={type}
                variant={currentType === type ? "secondary" : "outline"}
                size="sm"
                onClick={() => onTypeChange(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 min-w-fit border-l pl-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</span>
          <div className="flex gap-2">
            <Button 
              variant={!currentCategory ? "secondary" : "outline"} 
              size="sm"
              onClick={() => onCategoryChange(undefined)}
            >
              All
            </Button>
            {Object.values(ActivityCategory).map(cat => (
              <Button
                key={cat}
                variant={currentCategory === cat ? "secondary" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
