"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

interface DesignSelectorProps {
  currentDesign: number
  onDesignChange: (design: number) => void
}

const designs = [
  { id: 1, name: "Professional Blue", description: "Clean corporate design" },
  { id: 2, name: "Ocean Depths", description: "Deep blue-green theme" },
  { id: 3, name: "Industrial Gray", description: "Modern industrial look" },
  { id: 4, name: "Earth Tones", description: "Warm natural colors" },
  { id: 5, name: "Midnight Purple", description: "Dark elegant theme" },
]

export function DesignSelector({ currentDesign, onDesignChange }: DesignSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Palette className="h-4 w-4" />
          Design {currentDesign}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {designs.map((design) => (
          <DropdownMenuItem
            key={design.id}
            onClick={() => onDesignChange(design.id)}
            className={currentDesign === design.id ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{design.name}</span>
              <span className="text-xs text-muted-foreground">{design.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
