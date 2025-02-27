"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Edit, Copy, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

type Player = {
  id: number
  name: string
  rating: number
}

type Team = {
  id: number
  name: string
  color: string
  players: Player[]
}

type MatchDay = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"

export default function TeamManager() {
  const [players, setPlayers] = useState<Player[]>([])
  const [name, setName] = useState("")
  const [rating, setRating] = useState("")
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [error, setError] = useState("")
  const [matchDay, setMatchDay] = useState<MatchDay>("Saturday")
  const [matchTime, setMatchTime] = useState("20:00")
  const [groundName, setGroundName] = useState("Teenage Ground")
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [newRating, setNewRating] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  const [numberOfTeams, setNumberOfTeams] = useState(2)
  const [playersPerTeam, setPlayersPerTeam] = useState(5)
  const [teamColors, setTeamColors] = useState(["black", "white", "red", "blue", "green", "yellow", "orange", "purple"])

  useEffect(() => {
    const storedPlayers = localStorage.getItem("footballPlayers")
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("footballPlayers", JSON.stringify(players))
  }, [players])

  const addPlayer = () => {
    if (name && rating) {
      setPlayers([...players, { id: Date.now(), name, rating: Number.parseInt(rating) }])
      setName("")
      setRating("")
    }
  }

  const removePlayer = (id: number) => {
    setPlayers(players.filter((player) => player.id !== id))
    setSelectedPlayers(selectedPlayers.filter((playerId) => playerId !== id))
  }

  const togglePlayerSelection = (playerId: number) => {
    setSelectedPlayers((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  const shuffleArray = useCallback((array: Player[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }, [])

  const generateTeams = useCallback(() => {
    // Validate we have enough players selected
    if (selectedPlayers.length < numberOfTeams * playersPerTeam) {
      setError(
        `You need at least ${numberOfTeams * playersPerTeam} players selected to create ${numberOfTeams} teams with ${playersPerTeam} players each.`,
      )
      return
    }

    const selectedPlayerObjects = players.filter((player) => selectedPlayers.includes(player.id))
    const shuffled = shuffleArray([...selectedPlayerObjects])
    const sortedByRating = shuffled.sort((a, b) => b.rating - a.rating)

    const generatedTeams: Team[] = []

    // Create empty teams
    for (let i = 0; i < numberOfTeams; i++) {
      generatedTeams.push({
        id: i + 1,
        name: `Team ${i + 1}`,
        color: teamColors[i % teamColors.length],
        players: [],
      })
    }

    // Distribute players to balance teams by rating
    sortedByRating.forEach((player, index) => {
      const teamIndex = index % numberOfTeams
      if (generatedTeams[teamIndex].players.length < playersPerTeam) {
        generatedTeams[teamIndex].players.push(player)
      }
    })

    // Shuffle each team's players for randomness
    generatedTeams.forEach((team) => {
      team.players = shuffleArray([...team.players])
    })

    setTeams(generatedTeams)
    setError("")
  }, [players, selectedPlayers, shuffleArray, numberOfTeams, playersPerTeam, teamColors])

  const regenerateTeams = () => {
    generateTeams()
  }

  const formatTeamList = () => {
    const matchInfo = `${matchDay} Play ${matchTime}`

    let teamList = `
${matchInfo}
${groundName}

Team List:
`

    teams.forEach((team) => {
      teamList += `
${team.color.charAt(0).toUpperCase() + team.color.slice(1)} ${getTeamEmoji(team.color)}:
${team.players.map((player) => player.name).join("\n")}

`
    })

    return teamList
  }

  const getTeamEmoji = (color: string) => {
    const emojiMap: Record<string, string> = {
      black: "⚫️",
      white: "⚪️",
      red: "🔴",
      blue: "🔵",
      green: "🟢",
      yellow: "🟡",
      orange: "🟠",
      purple: "🟣",
    }
    return emojiMap[color] || ""
  }

  const openEditDialog = (player: Player) => {
    setEditingPlayer(player)
    setNewRating(player.rating.toString())
  }

  const updatePlayerRating = () => {
    if (editingPlayer && newRating) {
      const updatedPlayers = players.map((player) =>
        player.id === editingPlayer.id ? { ...player, rating: Number.parseInt(newRating) } : player,
      )
      setPlayers(updatedPlayers)
      setEditingPlayer(null)
      setNewRating("")
    }
  }

  const copyToClipboard = async () => {
    const teamList = formatTeamList()
    try {
      await navigator.clipboard.writeText(teamList)
      setIsCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The team list has been copied to your clipboard.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Copy failed",
        description: "Failed to copy the team list. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Football Team Manager</h1>

        <div className="mb-4">
          <Label htmlFor="name">Player Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2" />
          <Label htmlFor="rating">Player Rating (1-10)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mb-2"
          />
          <Button onClick={addPlayer}>Add Player</Button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Player List ({players.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {players.map((player) => (
              <div key={player.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`player-${player.id}`}
                  checked={selectedPlayers.includes(player.id)}
                  onCheckedChange={() => togglePlayerSelection(player.id)}
                />
                <label
                  htmlFor={`player-${player.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {player.name} - Rating: {player.rating}
                </label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(player)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit player rating</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Player Rating</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-rating" className="text-right">
                          New Rating
                        </Label>
                        <Input
                          id="new-rating"
                          type="number"
                          min="1"
                          max="10"
                          value={newRating}
                          onChange={(e) => setNewRating(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button onClick={updatePlayerRating}>Update Rating</Button>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" onClick={() => removePlayer(player.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove player</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Players: {selectedPlayers.length}</h2>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Match Day and Time</h2>
          <div className="flex items-center space-x-4 mb-2">
            <Select defaultValue="Saturday" onValueChange={(value) => setMatchDay(value as MatchDay)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sunday">Sunday</SelectItem>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
              </SelectContent>
            </Select>
            <Input type="time" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} className="w-[120px]" />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="ground-name">Ground Name</Label>
            <Input
              id="ground-name"
              value={groundName}
              onChange={(e) => setGroundName(e.target.value)}
              className="w-[250px]"
            />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Team Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number-of-teams">Number of Teams</Label>
              <Input
                id="number-of-teams"
                type="number"
                min="2"
                max="8"
                value={numberOfTeams}
                onChange={(e) => setNumberOfTeams(Number(e.target.value))}
                className="mb-2"
              />
            </div>
            <div>
              <Label htmlFor="players-per-team">Players per Team</Label>
              <Input
                id="players-per-team"
                type="number"
                min="1"
                max="11"
                value={playersPerTeam}
                onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
                className="mb-2"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Total players needed: {numberOfTeams * playersPerTeam} (Selected: {selectedPlayers.length})
          </p>
        </div>

        <div className="flex space-x-4 mb-4">
          <Button onClick={generateTeams}>Generate Teams</Button>
          <Button onClick={regenerateTeams} variant="outline">
            Regenerate Teams
          </Button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {teams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Generated Team List
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="ml-2"
                  aria-label="Copy team list to clipboard"
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-mono text-sm">{formatTeamList()}</pre>
            </CardContent>
          </Card>
        )}
      </main>
      <footer className="py-4 text-center bg-muted">
        <Link
          href="https://looth.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:underline"
        >
          Crafted by @im_root
        </Link>
      </footer>
    </div>
  )
}

