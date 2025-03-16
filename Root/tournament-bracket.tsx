"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Save, Database, FileSpreadsheet, UserPlus, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

type Wrestler = {
  id: string
  name: string
  alignment: "Face" | "Heel"
  finisher: string
  entranceMusic: string
  popularity: number
  championships: string[]
  weightClass: string
  age: string
  record: string
  style: string
  isTagTeam: boolean
  tagTeamPartner?: string
}

type Match = {
  id: number
  wrestler1: string
  wrestler2: string
  winner: string
  loser: string
}

type Round = Match[]

interface TournamentBracketProps {
  wrestlers: Wrestler[]
  setWrestlers: React.Dispatch<React.SetStateAction<Wrestler[]>>
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ wrestlers, setWrestlers }) => {
  const [tournamentName, setTournamentName] = useState("WWE Championship Tournament")
  const [rounds, setRounds] = useState<Round[]>([])
  const [participantCount, setParticipantCount] = useState(8)
  const [activeTab, setActiveTab] = useState("bracket")
  const [weightClasses, setWeightClasses] = useState<string[]>(["Heavyweight", "Middleweight", "Lightweight"])
  const [selectedWeightClass, setSelectedWeightClass] = useState(weightClasses[0])
  const [tournamentHistory, setTournamentHistory] = useState<any[]>([])
  const [newWrestler, setNewWrestler] = useState<Omit<Wrestler, "id">>({
    name: "",
    alignment: "Face",
    finisher: "",
    entranceMusic: "",
    popularity: 50,
    championships: [],
    weightClass: weightClasses[0],
    age: "",
    record: "0-0",
    style: "",
    isTagTeam: false,
    tagTeamPartner: "",
  })
  const [editingWrestler, setEditingWrestler] = useState<Wrestler | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newWeightClass, setNewWeightClass] = useState("")

  useEffect(() => {
    initializeTournament()
  }, [participantCount])

  useEffect(() => {
    const savedHistory = localStorage.getItem("wrestlingHistory")
    const savedWrestlers = localStorage.getItem("wrestlers")

    if (savedHistory) {
      setTournamentHistory(JSON.parse(savedHistory))
    }

    if (savedWrestlers) {
      setWrestlers(JSON.parse(savedWrestlers))
    } else {
      // Add some sample wrestlers if none exist
      const sampleWrestlers: Wrestler[] = [
        {
          id: "1",
          name: "John Smith",
          alignment: "Face",
          finisher: "F5",
          entranceMusic: "Some song",
          popularity: 75,
          championships: [],
          weightClass: "Heavyweight",
          age: "17",
          record: "12-2",
          style: "Technical",
          isTagTeam: false,
        },
        {
          id: "2",
          name: "Mike Johnson",
          alignment: "Heel",
          finisher: "Tombstone",
          entranceMusic: "Another song",
          popularity: 25,
          championships: [],
          weightClass: "Middleweight",
          age: "18",
          record: "15-1",
          style: "Powerhouse",
          isTagTeam: false,
        },
        {
          id: "3",
          name: "David Williams",
          alignment: "Face",
          finisher: "RKO",
          entranceMusic: "Yet another song",
          popularity: 60,
          championships: [],
          weightClass: "Lightweight",
          age: "16",
          record: "10-3",
          style: "High-Flyer",
          isTagTeam: false,
        },
        {
          id: "4",
          name: "Robert Brown",
          alignment: "Heel",
          finisher: "Spear",
          entranceMusic: "And another song",
          popularity: 40,
          championships: [],
          weightClass: "Heavyweight",
          age: "17",
          record: "8-4",
          style: "Brawler",
          isTagTeam: false,
        },
        {
          id: "5",
          name: "James Davis",
          alignment: "Face",
          finisher: "AA",
          entranceMusic: "More music",
          popularity: 80,
          championships: [],
          weightClass: "Middleweight",
          age: "18",
          record: "14-2",
          style: "All-Around",
          isTagTeam: false,
        },
        {
          id: "6",
          name: "Michael Miller",
          alignment: "Heel",
          finisher: "DDT",
          entranceMusic: "Even more music",
          popularity: 30,
          championships: [],
          weightClass: "Lightweight",
          age: "17",
          record: "11-3",
          style: "Technical",
          isTagTeam: false,
        },
        {
          id: "7",
          name: "William Wilson",
          alignment: "Face",
          finisher: "Stunner",
          entranceMusic: "Still more music",
          popularity: 70,
          championships: [],
          weightClass: "Heavyweight",
          age: "16",
          record: "9-5",
          style: "Powerhouse",
          isTagTeam: false,
        },
        {
          id: "8",
          name: "Richard Moore",
          alignment: "Heel",
          finisher: "Pedigree",
          entranceMusic: "The last song",
          popularity: 35,
          championships: [],
          weightClass: "Middleweight",
          age: "18",
          record: "13-1",
          style: "High-Flyer",
          isTagTeam: false,
        },
      ]
      setWrestlers(sampleWrestlers)
      localStorage.setItem("wrestlers", JSON.stringify(sampleWrestlers))
    }
  }, [])

  const addWeightClass = () => {
    if (newWeightClass && !weightClasses.includes(newWeightClass)) {
      setWeightClasses([...weightClasses, newWeightClass])
      setNewWeightClass("")
    }
  }

  const initializeTournament = () => {
    const newRounds: Round[] = []
    let matchId = 1
    let roundParticipants = participantCount

    while (roundParticipants > 1) {
      const roundMatches: Match[] = []
      for (let i = 0; i < roundParticipants / 2; i++) {
        roundMatches.push({ id: matchId++, wrestler1: "", wrestler2: "", winner: "", loser: "" })
      }
      newRounds.push(roundMatches)
      roundParticipants = roundParticipants / 2
    }

    setRounds(newRounds)
  }

  const handleWrestlerSelect = (
    roundIndex: number,
    matchIndex: number,
    position: "wrestler1" | "wrestler2",
    wrestlerId: string,
  ) => {
    const newRounds = [...rounds]
    newRounds[roundIndex][matchIndex][position] = wrestlerId
    setRounds(newRounds)
  }

  const handleMatchResult = (roundIndex: number, matchIndex: number, winnerId: string) => {
    const newRounds = [...rounds]
    const currentMatch = newRounds[roundIndex][matchIndex]
    currentMatch.winner = winnerId
    currentMatch.loser = currentMatch.wrestler1 === winnerId ? currentMatch.wrestler2 : currentMatch.wrestler1

    // Update next round if not the final
    if (roundIndex < newRounds.length - 1) {
      const nextRoundMatchIndex = Math.floor(matchIndex / 2)
      const nextRoundPosition = matchIndex % 2 === 0 ? "wrestler1" : "wrestler2"
      newRounds[roundIndex + 1][nextRoundMatchIndex][nextRoundPosition] = winnerId
    }

    setRounds(newRounds)

    // Update wrestler popularity and win-loss records
    const updatedWrestlers = wrestlers.map((wrestler) => {
      if (wrestler.id === winnerId) {
        const [wins, losses] = wrestler.record.split("-").map(Number)
        return {
          ...wrestler,
          popularity: Math.min(wrestler.popularity + 2, 100),
          record: `${wins + 1}-${losses}`,
        }
      } else if (wrestler.id === currentMatch.loser) {
        const [wins, losses] = wrestler.record.split("-").map(Number)
        return {
          ...wrestler,
          popularity: Math.max(wrestler.popularity - 1, 0),
          record: `${wins}-${losses + 1}`,
        }
      }
      return wrestler
    })

    setWrestlers(updatedWrestlers)
    localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))
  }

  const getWrestlerName = (id: string) => {
    const wrestler = wrestlers.find((w) => w.id === id)
    return wrestler ? wrestler.name : "TBD"
  }

  const getAvailableWrestlers = (roundIndex: number, matchIndex: number, position: "wrestler1" | "wrestler2") => {
    if (roundIndex === 0) {
      // First round: all wrestlers are available except those already selected in this round
      const selectedWrestlers = rounds[0].flatMap((match) => [match.wrestler1, match.wrestler2])
      return wrestlers.filter((w) => !selectedWrestlers.includes(w.id) || w.id === rounds[0][matchIndex][position])
    } else {
      // Other rounds: only the winners from the previous round are available
      const prevRound = rounds[roundIndex - 1]
      const availableWrestlers = prevRound.map((match) => match.winner).filter((id) => id !== "")
      return wrestlers.filter((w) => availableWrestlers.includes(w.id))
    }
  }

  const saveTournament = () => {
    // Check if we have a champion
    if (rounds.length === 0 || rounds[rounds.length - 1].length === 0 || !rounds[rounds.length - 1][0].winner) {
      alert("Please complete the tournament before saving")
      return
    }

    const championId = rounds[rounds.length - 1][0].winner
    if (!championId) {
      alert("Please complete the tournament before saving")
      return
    }

    const champion = wrestlers.find((w) => w.id === championId)

    const tournamentData = {
      id: Date.now(),
      name: tournamentName,
      date: new Date().toLocaleDateString(),
      weightClass: selectedWeightClass,
      champion: champion?.name || "Unknown",
      bracket: { ...rounds },
    }

    const updatedHistory = [...tournamentHistory, tournamentData]
    setTournamentHistory(updatedHistory)
    localStorage.setItem("wrestlingHistory", JSON.stringify(updatedHistory))

    // Reset bracket for new tournament
    initializeTournament()

    alert("Tournament saved successfully!")
  }

  // Reset tournament
  const resetTournament = () => {
    if (confirm("Are you sure you want to reset the tournament? All progress will be lost.")) {
      initializeTournament()
    }
  }

  // Modify the addWrestler function to include the style
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
      weightClass: weightClasses[0],
      age: "",
      record: "0-0",
      style: "",
      isTagTeam: false,
      tagTeamPartner: "",
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

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
            {tournamentName}
          </h1>
          <TabsList>
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
            <TabsTrigger value="wrestlers">Wrestlers</TabsTrigger>
            <TabsTrigger value="history">Tournament History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bracket" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tournamentName">Tournament Name</Label>
              <Input
                id="tournamentName"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                className="w-full md:w-64"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="participantCount">Number of Participants</Label>
              <Select value={participantCount.toString()} onValueChange={(value) => setParticipantCount(Number(value))}>
                <SelectTrigger id="participantCount" className="w-full md:w-40">
                  <SelectValue placeholder="Select participant count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={resetTournament}>
                Reset Tournament
              </Button>
              <Button onClick={saveTournament} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Tournament
              </Button>
            </div>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-4">
            {rounds.map((round, roundIndex) => (
              <div key={roundIndex} className="flex-none w-64">
                <Card>
                  <CardHeader>
                    <CardTitle>{roundIndex === rounds.length - 1 ? "Final" : `Round ${roundIndex + 1}`}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {round.map((match, matchIndex) => (
                      <Card key={match.id}>
                        <CardContent className="p-2 space-y-2">
                          <Select
                            value={match.wrestler1}
                            onValueChange={(value) => handleWrestlerSelect(roundIndex, matchIndex, "wrestler1", value)}
                            disabled={roundIndex > 0}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select wrestler" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableWrestlers(roundIndex, matchIndex, "wrestler1").map((wrestler) => (
                                <SelectItem key={wrestler.id} value={wrestler.id}>
                                  {wrestler.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={match.wrestler2}
                            onValueChange={(value) => handleWrestlerSelect(roundIndex, matchIndex, "wrestler2", value)}
                            disabled={roundIndex > 0}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select wrestler" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableWrestlers(roundIndex, matchIndex, "wrestler2").map((wrestler) => (
                                <SelectItem key={wrestler.id} value={wrestler.id}>
                                  {wrestler.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {match.wrestler1 && match.wrestler2 && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant={match.winner === match.wrestler1 ? "default" : "outline"}
                                onClick={() => handleMatchResult(roundIndex, matchIndex, match.wrestler1)}
                                className="flex-1"
                              >
                                {getWrestlerName(match.wrestler1)} Wins
                              </Button>
                              <Button
                                size="sm"
                                variant={match.winner === match.wrestler2 ? "default" : "outline"}
                                onClick={() => handleMatchResult(roundIndex, matchIndex, match.wrestler2)}
                                className="flex-1"
                              >
                                {getWrestlerName(match.wrestler2)} Wins
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          {rounds.length > 0 && rounds[rounds.length - 1][0].winner && (
            <Card className="bg-yellow-100 dark:bg-yellow-900">
              <CardContent className="p-4 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
                <span className="text-xl font-bold">
                  Tournament Winner: {getWrestlerName(rounds[rounds.length - 1][0].winner)}
                </span>
              </CardContent>
            </Card>
          )}
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
                      <Label htmlFor="weightClass">Weight Class</Label>
                      <Select
                        value={newWrestler.weightClass}
                        onValueChange={(value) => setNewWrestler({ ...newWrestler, weightClass: value })}
                      >
                        <SelectTrigger id="weightClass">
                          <SelectValue placeholder="Select weight class" />
                        </SelectTrigger>
                        <SelectContent>
                          {weightClasses.map((weightClass) => (
                            <SelectItem key={weightClass} value={weightClass}>
                              {weightClass}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={newWrestler.age}
                        onChange={(e) => setNewWrestler({ ...newWrestler, age: e.target.value })}
                        placeholder="Enter age"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="record">Record (W-L)</Label>
                      <Input
                        id="record"
                        value={newWrestler.record}
                        onChange={(e) => setNewWrestler({ ...newWrestler, record: e.target.value })}
                        placeholder="0-0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="style">Wrestling Style</Label>
                      <Textarea
                        id="style"
                        value={newWrestler.style}
                        onChange={(e) => setNewWrestler({ ...newWrestler, style: e.target.value })}
                        placeholder="Describe the wrestler's style"
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
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isTagTeam"
                        checked={newWrestler.isTagTeam}
                        onCheckedChange={(checked) => setNewWrestler({ ...newWrestler, isTagTeam: checked })}
                      />
                      <Label htmlFor="isTagTeam">Tag Team Wrestler</Label>
                    </div>
                    {newWrestler.isTagTeam && (
                      <div className="space-y-2">
                        <Label htmlFor="tagTeamPartner">Tag Team Partner</Label>
                        <Input
                          id="tagTeamPartner"
                          value={newWrestler.tagTeamPartner}
                          onChange={(e) => setNewWrestler({ ...newWrestler, tagTeamPartner: e.target.value })}
                          placeholder="Enter tag team partner's name"
                        />
                      </div>
                    )}

                    <Button onClick={addWrestler} className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Wrestler
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Manage Weight Classes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newWeightClass">Add New Weight Class</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="newWeightClass"
                          value={newWeightClass}
                          onChange={(e) => setNewWeightClass(e.target.value)}
                          placeholder="Enter new weight class"
                        />
                        <Button onClick={addWeightClass}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Weight Class Distribution</h3>
                      <div className="flex flex-wrap gap-2">
                        {weightClasses.map((weightClass) => {
                          const count = wrestlers.filter((w) => w.weightClass === weightClass).length
                          return (
                            <Badge key={weightClass} variant="outline" className="flex items-center gap-1">
                              {weightClass}
                              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {count}
                              </span>
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Weight Class</TableHead>
                    <TableHead>Alignment</TableHead>
                    <TableHead>Tag Team</TableHead>
                    <TableHead>Record (W-L)</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wrestlers.map((wrestler) => (
                    <TableRow key={wrestler.id}>
                      <TableCell className="font-medium">{wrestler.name}</TableCell>
                      <TableCell>{wrestler.weightClass}</TableCell>
                      <TableCell>{wrestler.alignment}</TableCell>
                      <TableCell>{wrestler.isTagTeam ? `Yes (${wrestler.tagTeamPartner})` : "No"}</TableCell>
                      <TableCell>{wrestler.record}</TableCell>
                      <TableCell>{wrestler.style}</TableCell>
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
                    <Label htmlFor="edit-weightClass">Weight Class</Label>
                    <Select
                      value={editingWrestler.weightClass}
                      onValueChange={(value) => setEditingWrestler({ ...editingWrestler, weightClass: value })}
                    >
                      <SelectTrigger id="edit-weightClass">
                        <SelectValue placeholder="Select weight class" />
                      </SelectTrigger>
                      <SelectContent>
                        {weightClasses.map((weightClass) => (
                          <SelectItem key={weightClass} value={weightClass}>
                            {weightClass}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-age">Age</Label>
                    <Input
                      id="edit-age"
                      type="number"
                      value={editingWrestler.age}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, age: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-record">Record (W-L)</Label>
                    <Input
                      id="edit-record"
                      value={editingWrestler.record}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, record: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-style">Wrestling Style</Label>
                    <Textarea
                      id="edit-style"
                      value={editingWrestler.style}
                      onChange={(e) => setEditingWrestler({ ...editingWrestler, style: e.target.value })}
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-isTagTeam"
                      checked={editingWrestler.isTagTeam}
                      onCheckedChange={(checked) => setEditingWrestler({ ...editingWrestler, isTagTeam: checked })}
                    />
                    <Label htmlFor="edit-isTagTeam">Tag Team Wrestler</Label>
                  </div>
                  {editingWrestler.isTagTeam && (
                    <div className="space-y-2">
                      <Label htmlFor="edit-tagTeamPartner">Tag Team Partner</Label>
                      <Input
                        id="edit-tagTeamPartner"
                        value={editingWrestler.tagTeamPartner}
                        onChange={(e) => setEditingWrestler({ ...editingWrestler, tagTeamPartner: e.target.value })}
                        placeholder="Enter tag team partner's name"
                      />
                    </div>
                  )}

                  <Button onClick={saveEditWrestler} className="w-full">
                    Save Changes
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Tournament History
              </CardTitle>
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => {
                  if (confirm("Are you sure you want to clear all tournament history?")) {
                    setTournamentHistory([])
                    localStorage.setItem("wrestlingHistory", JSON.stringify([]))
                  }
                }}
              >
                Clear History
              </Button>
            </CardHeader>
            <CardContent>
              {tournamentHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tournament Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Weight Class</TableHead>
                      <TableHead>Champion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tournamentHistory.map((tournament) => (
                      <TableRow key={tournament.id}>
                        <TableCell>{tournament.name}</TableCell>
                        <TableCell>{tournament.date}</TableCell>
                        <TableCell>{tournament.weightClass}</TableCell>
                        <TableCell className="font-medium">{tournament.champion}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRounds(tournament.bracket)
                              setTournamentName(tournament.name)
                              setSelectedWeightClass(tournament.weightClass)
                              setActiveTab("bracket")
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
                  <p>No tournament data saved yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TournamentBracket

