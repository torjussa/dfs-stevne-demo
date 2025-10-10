"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateCompetitionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCompetitionDialog({ open, onOpenChange }: CreateCompetitionDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "10:00",
    endTime: "16:00",
    targetCount: 10,
    slotDuration: 15,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to create the competition
    console.log("Create competition:", formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      name: "",
      location: "",
      startDate: "",
      endDate: "",
      startTime: "10:00",
      endTime: "16:00",
      targetCount: 10,
      slotDuration: 15,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Opprett nytt stevne</DialogTitle>
          <DialogDescription>Fyll ut informasjonen for å opprette et nytt stevne</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Stevnenavn *</Label>
              <Input
                id="name"
                placeholder="F.eks. Samlagsstemne Felt"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Sted *</Label>
              <Input
                id="location"
                placeholder="F.eks. Dale (Sunnfjord)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Startdato *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Sluttdato *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Starttid *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Sluttid *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetCount">Antall skiver *</Label>
              <Input
                id="targetCount"
                type="number"
                min="1"
                max="50"
                value={formData.targetCount}
                onChange={(e) => setFormData({ ...formData, targetCount: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slotDuration">Tidsluke (minutter) *</Label>
              <Input
                id="slotDuration"
                type="number"
                min="5"
                max="60"
                step="5"
                value={formData.slotDuration}
                onChange={(e) => setFormData({ ...formData, slotDuration: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit">Opprett stevne</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
