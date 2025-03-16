"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Save, Database, FileSpreadsheet, UserPlus, Edit, Trash2, Tv } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

// Add a new import for the tournament bracket component
import TournamentBracket from "./tournament-bracket"

// Define wrestler type
type Wrestler = {
  id: string
  name: string
  alignment: "Face" | "Heel"
  finisher: string
  entranceMusic: string
  popularity: number
  championships: string[]
}

type MatchType = {
  id: string
  name: string
}

type PromoType = {
  id: string
  name: string
}

type Promo = {
  id: string
  wrestlerId: string
  promoTypeId: string
  content: string
}

// Define match type
type Match = {
  id: number
  wrestler1: string
  wrestler2: string
  winner: string
  loser: string
  matchType: string
}

// Define event type
type Event = {
  [key: string]: {
    matches: Match[]
    promo?: Promo
  }
}

export default function WWEEvent() {
  // Event structure
  // const eventStructure = ["Opening Match", "Mid-Card", "Tag Team", "Women's Division", "Main Event"]

  // Match types
  // const matchTypes = [
  //   "Singles",
  //   "Tag Team",
  //   "Triple Threat",
  //   "Fatal 4-Way",
  //   "Submission",
  //   "Ladder",
  //   "Steel Cage",
  //   "Hell in a Cell",
  // ]

  const [matchTypes, setMatchTypes] = useState<MatchType[]>([
    { id: "1", name: "Singles" },
    { id: "2", name: "Tag Team" },
    { id: "3", name: "Triple Threat" },
    { id: "4", name: "Fatal 4-Way" },
    { id: "5", name: "Submission" },
    { id: "6", name: "Ladder" },
    { id: "7", name: "Steel Cage" },
    { id: "8", name: "Hell in a Cell" },
  ])

  const [promoTypes, setPromoTypes] = useState<PromoType[]>([
    { id: "1", name: "In-ring Promo" },
    { id: "2", name: "Backstage Interview" },
    { id: "3", name: "Video Package" },
    { id: "4", name: "Contract Signing" },
  ])

  // Initial event structure
  // const initialEvent: Event = {
  //   "Opening Match": [{ id: 1, wrestler1: "", wrestler2: "", winner: "", loser: "", matchType: "Singles" }],
  //   "Mid-Card": [
  //     { id: 2, wrestler1: "", wrestler2: "", winner: "", loser: "", matchType: "Singles" },
  //     { id: 3, wrestler1: "", wrestler2: "", winner: "", loser: "", matchType: "Singles" },
  //   ],
  //   "Tag Team": [{ id: 4, wrestler1: "", wrestler2: "", winner: "", loser: "", matchType: "Tag Team" }],
  //   "Women's Division": [{ id: 5, wrestler1: "", wrestler2: "", winner: "", loser: "", matchType: "Singles" }],
  //   "Main Event": [{ id: 6, wrestler1: "", wrestler2: "", winner: "", loser: "", matchType: "Singles" }],
  // }

  // State for event and data
  // const [event, setEvent] = useState<Event>(initialEvent)
  const [event, setEvent] = useState<Event>({})
  const [eventName, setEventName] = useState("WWE Supershow 2024")
  const [eventHistory, setEventHistory] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("event")
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([])
  // const [selectedMatchType, setSelectedMatchType] = useState(matchTypes[0])
  const [matchCount, setMatchCount] = useState(5)
  const [newMatchType, setNewMatchType] = useState("")
  const [newPromoType, setNewPromoType] = useState("")

  // State for new wrestler form
  const [newWrestler, setNewWrestler] = useState<Omit<Wrestler, "id">>({
    name: "",
    alignment: "Face",
    finisher: "",
    entranceMusic: "",
    popularity: 50,
    championships: [],
  })

  // State for edit wrestler
  const [editingWrestler, setEditingWrestler] = useState<Wrestler | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    initializeEvent()
  }, [matchCount])

  const initializeEvent = () => {
    const newEvent: Event = {}
    for (let i = 1; i <= matchCount; i++) {
      newEvent[`Match ${i}`] = {
        matches: [{ id: i, wrestler1: "", wrestler2: "", winner: "", loser: "", matchType: "Singles" }],
      }
    }
    setEvent(newEvent)
  }

  const handleMatchTypeChange = (matchKey: string, matchType: string) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      [matchKey]: {
        ...prevEvent[matchKey],
        matches: prevEvent[matchKey].matches.map((match) => ({ ...match, matchType })),
      },
    }))
  }

  const handlePromoChange = (matchKey: string, wrestlerId: string, promoTypeId: string, content: string) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      [matchKey]: {
        ...prevEvent[matchKey],
        promo: { id: Date.now().toString(), wrestlerId, promoTypeId, content },
      },
    }))
  }

  const addMatchType = () => {
    if (newMatchType) {
      setMatchTypes([...matchTypes, { id: Date.now().toString(), name: newMatchType }])
      setNewMatchType("")
    }
  }

  const removeMatchType = (id: string) => {
    setMatchTypes(matchTypes.filter((type) => type.id !== id))
  }

  const addPromoType = () => {
    if (newPromoType) {
      setPromoTypes([...promoTypes, { id: Date.now().toString(), name: newPromoType }])
      setNewPromoType("")
    }
  }

  const removePromoType = (id: string) => {
    setPromoTypes(promoTypes.filter((type) => type.id !== id))
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEvent = localStorage.getItem("wweEvent")
    const savedHistory = localStorage.getItem("wweHistory")
    const savedWrestlers = localStorage.getItem("wrestlers")

    if (savedEvent) {
      setEvent(JSON.parse(savedEvent))
    }

    if (savedHistory) {
      setEventHistory(JSON.parse(savedHistory))
    }

    if (savedWrestlers) {
      setWrestlers(JSON.parse(savedWrestlers))
    } else {
      // Add some sample wrestlers if none exist
      const sampleWrestlers: Wrestler[] = [
        {
          id: "1",
          name: "John Cena",
          alignment: "Face",
          finisher: "Attitude Adjustment",
          entranceMusic: "The Time is Now",
          popularity: 90,
          championships: ["WWE Championship", "United States Championship"],
        },
        {
          id: "2",
          name: "Roman Reigns",
          alignment: "Heel",
          finisher: "Spear",
          entranceMusic: "Head of the Table",
          popularity: 95,
          championships: ["Universal Championship"],
        },
        {
          id: "3",
          name: "Becky Lynch",
          alignment: "Face",
          finisher: "Dis-arm-her",
          entranceMusic: "Celtic Invasion",
          popularity: 88,
          championships: ["Raw Women's Championship"],
        },
        {
          id: "4",
          name: "Seth Rollins",
          alignment: "Heel",
          finisher: "Curb Stomp",
          entranceMusic: "The Second Coming",
          popularity: 87,
          championships: ["Intercontinental Championship"],
        },
        {
          id: "5",
          name: "Charlotte Flair",
          alignment: "Heel",
          finisher: "Figure Eight",
          entranceMusic: "Recognition",
          popularity: 89,
          championships: ["SmackDown Women's Championship"],
        },
        {
          id: "6",
          name: "Kofi Kingston",
          alignment: "Face",
          finisher: "Trouble in Paradise",
          entranceMusic: "New Day, New Way",
          popularity: 82,
          championships: ["Tag Team Championship"],
        },
        {
          id: "7",
          name: "Asuka",
          alignment: "Face",
          finisher: "Asuka Lock",
          entranceMusic: "The Future",
          popularity: 85,
          championships: ["Women's Tag Team Championship"],
        },
        {
          id: "8",
          name: "Randy Orton",
          alignment: "Heel",
          finisher: "RKO",
          entranceMusic: "Voices",
          popularity: 86,
          championships: [],
        },
      ]
      setWrestlers(sampleWrestlers)
      localStorage.setItem("wrestlers", JSON.stringify(sampleWrestlers))
    }
  }, [])

  // Handle wrestler selection
  const handleWrestlerSelect = (segment: string, matchId: number, position: string, wrestlerId: string) => {
    const updatedEvent = { ...event }
    if (!updatedEvent[segment]) {
      updatedEvent[segment] = { matches: [] }
    }
    updatedEvent[segment].matches = updatedEvent[segment].matches.map((match) => {
      if (match.id === matchId) {
        return { ...match, [position]: wrestlerId }
      }
      return match
    })

    setEvent(updatedEvent)
    localStorage.setItem("wweEvent", JSON.stringify(updatedEvent))
  }

  // Handle match result
  const handleMatchResult = (segment: string, matchId: number, winnerId: string) => {
    const updatedEvent = { ...event }

    // Find the current match
    const currentMatch = updatedEvent[segment].matches.find((match) => match.id === matchId)
    if (!currentMatch || !currentMatch.wrestler1 || !currentMatch.wrestler2) return

    // Set winner and loser
    const loserId = winnerId === currentMatch.wrestler1 ? currentMatch.wrestler2 : currentMatch.wrestler1
    currentMatch.winner = winnerId
    currentMatch.loser = loserId

    // Update wrestler popularity
    const updatedWrestlers = wrestlers.map((wrestler) => {
      if (wrestler.id === winnerId) {
        return { ...wrestler, popularity: Math.min(wrestler.popularity + 2, 100) }
      } else if (wrestler.id === loserId) {
        return { ...wrestler, popularity: Math.max(wrestler.popularity - 1, 0) }
      }
      return wrestler
    })

    setWrestlers(updatedWrestlers)
    localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))

    setEvent(updatedEvent)
    localStorage.setItem("wweEvent", JSON.stringify(updatedEvent))
  }

  // Save event to history
  const saveEvent = () => {
    // Check if all matches have winners
    const allMatchesComplete = Object.values(event).every((segmentData) =>
      segmentData.matches.every((match) => match.winner !== ""),
    )

    if (!allMatchesComplete) {
      alert("Please complete all matches before saving the event")
      return
    }

    const eventData = {
      id: Date.now(),
      name: eventName,
      date: new Date().toLocaleDateString(),
      matches: { ...event },
    }

    const updatedHistory = [...eventHistory, eventData]
    setEventHistory(updatedHistory)
    localStorage.setItem("wweHistory", JSON.stringify(updatedHistory))

    // Reset event for new show
    // setEvent(initialEvent)
    initializeEvent()
    localStorage.setItem("wweEvent", JSON.stringify({}))

    alert("Event saved successfully!")
  }

  // Reset event
  const resetEvent = () => {
    if (confirm("Are you sure you want to reset the event? All progress will be lost.")) {
      // setEvent(initialEvent)
      initializeEvent()
      localStorage.setItem("wweEvent", JSON.stringify({}))
    }
  }

  // Get available wrestlers (wrestlers not already selected in the current segment)
  const getAvailableWrestlers = (segment: string, matchId: number, position: string) => {
    if (!event[segment]) return []
    const currentMatch = event[segment].matches.find((match) => match.id === matchId)
    if (!currentMatch) return []

    const otherPosition = position === "wrestler1" ? "wrestler2" : "wrestler1"

    // Wrestlers already selected in this segment
    const selectedWrestlerIds = event[segment].matches
      .filter((match) => match.id !== matchId) // Exclude current match
      .flatMap((match) => [match.wrestler1, match.wrestler2])
      .filter((id) => id) // Remove empty strings

    // Don't include the other wrestler in the current match
    if (currentMatch[otherPosition]) {
      selectedWrestlerIds.push(currentMatch[otherPosition])
    }

    // All wrestlers are available except those already selected
    return wrestlers.filter(
      (wrestler) => !selectedWrestlerIds.includes(wrestler.id) || wrestler.id === currentMatch[position],
    )
  }

  // Add new wrestler
  const addWrestler = () => {
    if (!newWrestler.name) {
      alert("Wrestler name is required")
      return
    }

    const wrestler: Wrestler = {
      ...newWrestler,
      id: Date.now().toString(),
    }

    const updatedWrestlers = [...wrestlers, wrestler]
    setWrestlers(updatedWrestlers)
    localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))

    // Reset form
    setNewWrestler({
      name: "",
      alignment: "Face",
      finisher: "",
      entranceMusic: "",
      popularity: 50,
      championships: [],
    })
  }

  // Delete wrestler
  const deleteWrestler = (id: string) => {
    if (confirm("Are you sure you want to delete this wrestler?")) {
      const updatedWrestlers = wrestlers.filter((wrestler) => wrestler.id !== id)
      setWrestlers(updatedWrestlers)
      localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))
    }
  }

  // Edit wrestler
  const startEditWrestler = (wrestler: Wrestler) => {
    setEditingWrestler(wrestler)
    setIsEditDialogOpen(true)
  }

  const saveEditWrestler = () => {
    if (!editingWrestler) return

    const updatedWrestlers = wrestlers.map((wrestler) =>
      wrestler.id === editingWrestler.id ? editingWrestler : wrestler,
    )

    setWrestlers(updatedWrestlers)
    localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))
    setIsEditDialogOpen(false)
  }

  // Get wrestler name by ID
  const getWrestlerName = (id: string) => {
    const wrestler = wrestlers.find((w) => w.id === id)
    return wrestler ? wrestler.name : "Unknown"
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <Tv className="mr-2 h-6 w-6 text-red-500" />
            {eventName}
          </h1>
          <TabsList>
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="wrestlers">Wrestlers</TabsTrigger>
            <TabsTrigger value="matchTypes">Match Types</TabsTrigger>
            <TabsTrigger value="promoTypes">Promo Types</TabsTrigger>
            <TabsTrigger value="tournament">Tournament</TabsTrigger>
            <TabsTrigger value="history">Event History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="event" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full md:w-64"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="matchCount">Number of Matches</Label>
              <Select value={matchCount.toString()} onValueChange={(value) => setMatchCount(Number(value))}>
                <SelectTrigger id="matchCount" className="w-full md:w-40">
                  <SelectValue placeholder="Select match count" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7, 8].map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={resetEvent}>
                Reset Event
              </Button>
              <Button onClick={saveEvent} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Event
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(event).map(([matchKey, matchData]) => (
              <Card key={matchKey}>
                <CardHeader>
                  <CardTitle>{matchKey}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {matchData.matches.map((match) => (
                    <div key={match.id} className="border p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Match {match.id}</h3>
                        <Select
                          value={match.matchType}
                          onValueChange={(value) => handleMatchTypeChange(matchKey, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select match type" />
                          </SelectTrigger>
                          <SelectContent>
                            {matchTypes.map((type) => (
                              <SelectItem key={type.id} value={type.name}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Wrestler 1</Label>
                          <Select
                            value={match.wrestler1}
                            onValueChange={(value) => handleWrestlerSelect(matchKey, match.id, "wrestler1", value)}
                          >
                            <SelectTrigger
                              className={`w-full ${match.winner === match.wrestler1 ? "bg-green-100 border-green-500" : match.loser === match.wrestler1 ? "bg-red-100 border-red-500" : ""}`}
                            >
                              <SelectValue placeholder="Select wrestler">
                                {match.wrestler1 ? getWrestlerName(match.wrestler1) : "Select wrestler"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Select wrestler">Select wrestler</SelectItem>
                              {getAvailableWrestlers(matchKey, match.id, "wrestler1").map((wrestler) => (
                                <SelectItem key={wrestler.id} value={wrestler.id}>
                                  {wrestler.name} ({wrestler.alignment})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {match.wrestler1 && match.wrestler2 && (
                            <Button
                              size="sm"
                              variant={match.winner === match.wrestler1 ? "default" : "outline"}
                              onClick={() => handleMatchResult(matchKey, match.id, match.wrestler1)}
                              className="w-full"
                            >
                              Win
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Wrestler 2</Label>
                          <Select
                            value={match.wrestler2}
                            onValueChange={(value) => handleWrestlerSelect(matchKey, match.id, "wrestler2", value)}
                          >
                            <SelectTrigger
                              className={`w-full ${match.winner === match.wrestler2 ? "bg-green-100 border-green-500" : match.loser === match.wrestler2 ? "bg-red-100 border-red-500" : ""}`}
                            >
                              <SelectValue placeholder="Select wrestler">
                                {match.wrestler2 ? getWrestlerName(match.wrestler2) : "Select wrestler"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Select wrestler">Select wrestler</SelectItem>
                              {getAvailableWrestlers(matchKey, match.id, "wrestler2").map((wrestler) => (
                                <SelectItem key={wrestler.id} value={wrestler.id}>
                                  {wrestler.name} ({wrestler.alignment})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {match.wrestler1 && match.wrestler2 && (
                            <Button
                              size="sm"
                              variant={match.winner === match.wrestler2 ? "default" : "outline"}
                              onClick={() => handleMatchResult(matchKey, match.id, match.wrestler2)}
                              className="w-full"
                            >
                              Win
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold">Promo</h3>
                    <Select
                      value={matchData.promo?.wrestlerId || ""}
                      onValueChange={(value) =>
                        handlePromoChange(
                          matchKey,
                          value,
                          matchData.promo?.promoTypeId || "",
                          matchData.promo?.content || "",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select wrestler for promo" />
                      </SelectTrigger>
                      <SelectContent>
                        {wrestlers.map((wrestler) => (
                          <SelectItem key={wrestler.id} value={wrestler.id}>
                            {wrestler.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={matchData.promo?.promoTypeId || ""}
                      onValueChange={(value) =>
                        handlePromoChange(
                          matchKey,
                          matchData.promo?.wrestlerId || "",
                          value,
                          matchData.promo?.content || "",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select promo type" />
                      </SelectTrigger>
                      <SelectContent>
                        {promoTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Enter promo content"
                      value={matchData.promo?.content || ""}
                      onChange={(e) =>
                        handlePromoChange(
                          matchKey,
                          matchData.promo?.wrestlerId || "",
                          matchData.promo?.promoTypeId || "",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wrestlers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Wrestler Database
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Wrestler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newWrestler.name}
                        onChange={(e) => setNewWrestler({ ...newWrestler, name: e.target.value })}
                        placeholder="Enter wrestler name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alignment">Alignment</Label>
                      <Select
                        value={newWrestler.alignment}
                        onValueChange={(value: "Face" | "Heel") => setNewWrestler({ ...newWrestler, alignment: value })}
                      >
                        <SelectTrigger id="alignment">
                          <SelectValue placeholder="Select alignment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Face">Face</SelectItem>
                          <SelectItem value="Heel">Heel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="finisher">Finisher</Label>
                      <Input
                        id="finisher"
                        value={newWrestler.finisher}
                        onChange={(e) => setNewWrestler({ ...newWrestler, finisher: e.target.value })}
                        placeholder="Enter finisher move"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="entranceMusic">Entrance Music</Label>
                      <Input
                        id="entranceMusic"
                        value={newWrestler.entranceMusic}
                        onChange={(e) => setNewWrestler({ ...newWrestler, entranceMusic: e.target.value })}
                        placeholder="Enter entrance music"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="popularity">Popularity</Label>
                      <Slider
                        id="popularity"
                        min={0}
                        max={100}
                        step={1}
                        value={[newWrestler.popularity]}
                        onValueChange={(value) => setNewWrestler({ ...newWrestler, popularity: value[0] })}
                      />
                      <div className="text-center">{newWrestler.popularity}%</div>
                    </div>

                    <Button onClick={addWrestler} className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Wrestler
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wrestler Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Alignment Distribution</h3>
                      <div className="flex justify-around">
                        <Badge variant="secondary" className="text-blue-500">
                          Face: {wrestlers.filter((w) => w.alignment === "Face").length}
                        </Badge>
                        <Badge variant="secondary" className="text-red-500">
                          Heel: {wrestlers.filter((w) => w.alignment === "Heel").length}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Top Wrestlers by Popularity</h3>
                      <ol className="list-decimal list-inside">
                        {wrestlers
                          .sort((a, b) => b.popularity - a.popularity)
                          .slice(0, 5)
                          .map((wrestler) => (
                            <li key={wrestler.id}>
                              {wrestler.name} ({wrestler.popularity}%)
                            </li>
                          ))}
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Alignment</TableHead>
                    <TableHead>Finisher</TableHead>
                    <TableHead>Popularity</TableHead>
                    <TableHead>Championships</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wrestlers.map((wrestler) => (
                    <TableRow key={wrestler.id}>
                      <TableCell className="font-medium">{wrestler.name}</TableCell>
                      <TableCell>{wrestler.alignment}</TableCell>
                      <TableCell>{wrestler.finisher}</TableCell>
                      <TableCell>{wrestler.popularity}%</TableCell>
                      <TableCell>{wrestler.championships.join(", ")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => startEditWrestler(wrestler)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteWrestler(wrestler.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Wrestler</DialogTitle>
              </DialogHeader>
              {editingWrestler && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={editingWrestler.name}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-alignment">Alignment</Label>
                    <Select
                      value={editingWrestler.alignment}
                      onValueChange={(value: "Face" | "Heel") =>
                        setEditingWrestler({ ...editingWrestler, alignment: value })
                      }
                    >
                      <SelectTrigger id="edit-alignment">
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Face">Face</SelectItem>
                        <SelectItem value="Heel">Heel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-finisher">Finisher</Label>
                    <Input
                      id="edit-finisher"
                      value={editingWrestler.finisher}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, finisher: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-entranceMusic">Entrance Music</Label>
                    <Input
                      id="edit-entranceMusic"
                      value={editingWrestler.entranceMusic}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, entranceMusic: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-popularity">Popularity</Label>
                    <Slider
                      id="edit-popularity"
                      min={0}
                      max={100}
                      step={1}
                      value={[editingWrestler.popularity]}
                      onValueChange={(value) => setEditingWrestler({ ...editingWrestler, popularity: value[0] })}
                    />
                    <div className="text-center">{editingWrestler.popularity}%</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-championships">Championships</Label>
                    <Input
                      id="edit-championships"
                      value={editingWrestler.championships.join(", ")}
                      onChange={(e) =>
                        setEditingWrestler({ ...editingWrestler, championships: e.target.value.split(", ") })
                      }
                    />
                    <p className="text-sm text-muted-foreground">Separate multiple championships with commas</p>
                  </div>

                  <Button onClick={saveEditWrestler} className="w-full">
                    Save Changes
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="matchTypes">
          <Card>
            <CardHeader>
              <CardTitle>Manage Match Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="New match type"
                  value={newMatchType}
                  onChange={(e) => setNewMatchType(e.target.value)}
                />
                <Button onClick={addMatchType}>Add</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Match Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => removeMatchType(type.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promoTypes">
          <Card>
            <CardHeader>
              <CardTitle>Manage Promo Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="New promo type"
                  value={newPromoType}
                  onChange={(e) => setNewPromoType(e.target.value)}
                />
                <Button onClick={addPromoType}>Add</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Promo Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => removePromoType(type.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tournament">
          <TournamentBracket wrestlers={wrestlers} setWrestlers={setWrestlers} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Event History
              </CardTitle>
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => {
                  if (confirm("Are you sure you want to clear all event history?")) {
                    setEventHistory([])
                    localStorage.setItem("wweHistory", JSON.stringify([]))
                  }
                }}
              >
                Clear History
              </Button>
            </CardHeader>
            <CardContent>
              {eventHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Main Event Winner</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventHistory.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell className="font-medium">
                          {getWrestlerName(
                            event.matches["Main Event"]?.matches[0]?.winner ||
                              event.matches["Match 5"]?.matches[0]?.winner ||
                              "",
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEvent(event.matches)
                              setEventName(event.name)
                              setActiveTab("event")
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileSpreadsheet className="mx-auto h-12 w-12 mb-2" />
                  <p>No event data saved yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

