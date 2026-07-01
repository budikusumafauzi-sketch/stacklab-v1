import * as React from "react"
import { cn } from "../../lib/utils"

const Toolbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-1 p-1 w-full", className)}
    {...props}
  />
))
Toolbar.displayName = "Toolbar"

const ToolbarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center space-x-1", className)} {...props} />
))
ToolbarGroup.displayName = "ToolbarGroup"

const ToolbarDivider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-[1px] h-4 bg-border mx-2", className)} {...props} />
))
ToolbarDivider.displayName = "ToolbarDivider"

const ToolbarButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }>(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-2 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground",
      active && "bg-secondary text-foreground",
      className
    )}
    {...props}
  />
))
ToolbarButton.displayName = "ToolbarButton"

export { Toolbar, ToolbarGroup, ToolbarDivider, ToolbarButton }
