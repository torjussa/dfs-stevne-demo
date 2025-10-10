"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"

export function CompetitionFilters() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Søk etter stevne</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Søk etter stevne..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-from">Fra dato</Label>
        <Input id="date-from" type="date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-to">Til dato</Label>
        <Input id="date-to" type="date" />
      </div>

      <Button variant="outline" className="w-full bg-transparent">
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Flere filtre
      </Button>

      <Button variant="secondary" className="w-full">
        Nullstill filter
      </Button>
    </div>
  )
}
