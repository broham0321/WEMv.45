document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  initApp()
})

function initApp() {
  // Set up tab navigation
  setupTabs()

  // Load data from localStorage
  const wrestlers = loadWrestlers()
  const championships = loadChampionships()
  const tournaments = loadTournaments()
  const matchTypes = loadMatchTypes()
  const brands = loadBrands()

  // Initialize default data if needed
  initializeDefaultData()

  // Populate wrestler selection
  populateWrestlerSelection(wrestlers)

  // Populate championship dropdown
  populateChampionshipDropdown(championships)

  // Set up tournament creation
  setupTournamentCreation(wrestlers, championships)

  // Display tournaments list
  displayTournamentsList(tournaments)

  // Set up tournament selection
  setupTournamentSelection(tournaments, wrestlers, championships)

  // Set up wrestler management
  setupWrestlerManagement(wrestlers, championships, brands)

  // Set up championship management
  setupChampionshipManagement(championships, wrestlers)
}

// Initialize default data if not present
function initializeDefaultData() {
  // Default match types
  if (!localStorage.getItem("matchTypes")) {
    const defaultMatchTypes = [
      {
        id: "singles",
        name: "Singles Match",
        description: "Standard one-on-one match",
        category: "Match",
      },
      {
        id: "tag-team",
        name: "Tag Team Match",
        description: "Two teams of two wrestlers",
        category: "Match",
      },
      {
        id: "triple-threat",
        name: "Triple Threat",
        description: "Three wrestlers compete against each other",
        category: "Match",
      },
      {
        id: "fatal-four-way",
        name: "Fatal Four-Way",
        description: "Four wrestlers compete against each other",
        category: "Match",
      },
    ]
    localStorage.setItem("matchTypes", JSON.stringify(defaultMatchTypes))
  }

  // Default brands
  if (!localStorage.getItem("brands")) {
    const defaultBrands = [
      {
        id: "raw",
        name: "Raw",
        color: "bg-red-600",
      },
      {
        id: "smackdown",
        name: "SmackDown",
        color: "bg-blue-600",
      },
      {
        id: "nxt",
        name: "NXT",
        color: "bg-yellow-500",
      },
      {
        id: "free-agent",
        name: "Free Agent",
        color: "bg-gray-500",
      },
    ]
    localStorage.setItem("brands", JSON.stringify(defaultBrands))
  }

  // Default championships
  if (!localStorage.getItem("championships")) {
    const defaultChampionships = [
      {
        id: "wwe-championship",
        name: "WWE Championship",
        description: "The most prestigious title in sports entertainment",
        division: "Men's",
        image:
          "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/WWE_Championship--1a1d43b9cb5c500dab3c231e57193f1a.png",
      },
      {
        id: "universal-championship",
        name: "Universal Championship",
        description: "The top championship on Raw",
        division: "Universal",
        image:
          "https://www.wwe.com/f/styles/wwe_16_9_s/public/all/2019/10/Universal_Championship--3ce10a2c5396a9147d97307a2d2acca1.png",
      },
    ]
    localStorage.setItem("championships", JSON.stringify(defaultChampionships))
  }
}

// Tab Navigation
function setupTabs() {
  const tabs = document.querySelectorAll(".tab")
  const tabContents = document.querySelectorAll(".tab-content")

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab")

      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to selected tab and content
      tab.classList.add("active")
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })
}

// Load data from localStorage
function loadWrestlers() {
  const storedWrestlers = localStorage.getItem("wrestlers")
  return storedWrestlers ? JSON.parse(storedWrestlers) : []
}

function loadChampionships() {
  const storedChampionships = localStorage.getItem("championships")
  return storedChampionships ? JSON.parse(storedChampionships) : []
}

function loadTournaments() {
  const storedTournaments = localStorage.getItem("tournaments")
  return storedTournaments ? JSON.parse(storedTournaments) : []
}

function loadMatchTypes() {
  const storedMatchTypes = localStorage.getItem("matchTypes")
  return storedMatchTypes ? JSON.parse(storedMatchTypes) : []
}

function loadBrands() {
  const storedBrands = localStorage.getItem("brands")
  return storedBrands ? JSON.parse(storedBrands) : []
}

// Populate wrestler selection
function populateWrestlerSelection(wrestlers) {
  const wrestlerSelection = document.getElementById("wrestlerSelection")
  wrestlerSelection.innerHTML = ""

  if (wrestlers.length === 0) {
    wrestlerSelection.innerHTML = '<div class="empty-state">No wrestlers found. Add wrestlers first.</div>'
    return
  }

  wrestlers.forEach((wrestler) => {
    const wrestlerItem = document.createElement("button")
    wrestlerItem.className = "wrestler-item"
    wrestlerItem.setAttribute("data-id", wrestler.id)
    wrestlerItem.textContent = wrestler.name

    wrestlerItem.addEventListener("click", () => toggleWrestlerSelection(wrestlerItem))

    wrestlerSelection.appendChild(wrestlerItem)
  })
}

// Toggle wrestler selection
function toggleWrestlerSelection(wrestlerItem) {
  const participantCount = Number.parseInt(document.getElementById("participantCount").value)
  const selectedWrestlers = document.querySelectorAll(".wrestler-item.selected")

  if (wrestlerItem.classList.contains("selected")) {
    wrestlerItem.classList.remove("selected")
  } else {
    if (selectedWrestlers.length < participantCount) {
      wrestlerItem.classList.add("selected")
    }
  }

  // Update selection count
  updateSelectionCount(selectedWrestlers.length)

  // Enable/disable clear selection button
  const clearSelectionBtn = document.getElementById("clearSelection")
  clearSelectionBtn.disabled = selectedWrestlers.length === 0

  // Enable/disable create tournament button
  const createTournamentBtn = document.getElementById("createTournament")
  createTournamentBtn.disabled =
    selectedWrestlers.length !== participantCount || document.getElementById("tournamentName").value === ""
}

// Update selection count
function updateSelectionCount(count) {
  const participantCount = Number.parseInt(document.getElementById("participantCount").value)
  const label = document.querySelector('label[for="wrestlerSelection"]')
  label.textContent = `Select Wrestlers (${count}/${participantCount})`
}

// Populate championship dropdown
function populateChampionshipDropdown(championships) {
  const championshipSelect = document.getElementById("championship")

  // Clear existing options except the first one
  while (championshipSelect.options.length > 1) {
    championshipSelect.remove(1)
  }

  // Add championship options
  championships.forEach((championship) => {
    const option = document.createElement("option")
    option.value = championship.id
    option.textContent = championship.name
    championshipSelect.appendChild(option)
  })
}

// Set up tournament creation
function setupTournamentCreation(wrestlers, championships) {
  const tournamentNameInput = document.getElementById("tournamentName")
  const participantCountSelect = document.getElementById("participantCount")
  const clearSelectionBtn = document.getElementById("clearSelection")
  const createTournamentBtn = document.getElementById("createTournament")

  // Tournament name input change
  tournamentNameInput.addEventListener("input", () => {
    const selectedWrestlers = document.querySelectorAll(".wrestler-item.selected")
    const participantCount = Number.parseInt(participantCountSelect.value)

    createTournamentBtn.disabled = tournamentNameInput.value === "" || selectedWrestlers.length !== participantCount
  })

  // Participant count change
  participantCountSelect.addEventListener("change", () => {
    const participantCount = Number.parseInt(participantCountSelect.value)

    // Clear wrestler selection
    document.querySelectorAll(".wrestler-item.selected").forEach((item) => {
      item.classList.remove("selected")
    })

    // Update selection count
    updateSelectionCount(0)

    // Disable buttons
    clearSelectionBtn.disabled = true
    createTournamentBtn.disabled = true
  })

  // Clear selection button
  clearSelectionBtn.addEventListener("click", () => {
    document.querySelectorAll(".wrestler-item.selected").forEach((item) => {
      item.classList.remove("selected")
    })

    // Update selection count
    updateSelectionCount(0)

    // Disable buttons
    clearSelectionBtn.disabled = true
    createTournamentBtn.disabled = true
  })

  // Create tournament button
  createTournamentBtn.addEventListener("click", () => {
    createTournament(wrestlers, championships)
  })
}

// Create tournament
function createTournament(wrestlers, championships) {
  const tournamentName = document.getElementById("tournamentName").value
  const tournamentDate = document.getElementById("tournamentDate").value
  const participantCount = Number.parseInt(document.getElementById("participantCount").value)
  const championshipId = document.getElementById("championship").value

  // Get selected wrestlers
  const selectedWrestlerElements = document.querySelectorAll(".wrestler-item.selected")
  const selectedWrestlerIds = Array.from(selectedWrestlerElements).map((el) => el.getAttribute("data-id"))

  // Validate
  if (tournamentName === "" || selectedWrestlerIds.length !== participantCount) {
    alert("Please fill in all required fields and select the correct number of wrestlers.")
    return
  }

  // Generate matches
  const matches = generateMatches(participantCount)

  // Assign wrestlers to first round matches
  const shuffledWrestlers = [...selectedWrestlerIds].sort(() => Math.random() - 0.5)
  const firstRoundMatches = matches.filter((match) => match.round === 1)

  firstRoundMatches.forEach((match, index) => {
    match.wrestler1Id = shuffledWrestlers[index * 2]
    match.wrestler2Id = shuffledWrestlers[index * 2 + 1]
  })

  // Create tournament object
  const tournament = {
    id: Date.now().toString(),
    name: tournamentName,
    date: tournamentDate,
    participants: participantCount,
    matches: matches,
    championshipId: championshipId !== "none" ? championshipId : undefined,
    completed: false,
  }

  // Save tournament
  const tournaments = loadTournaments()
  tournaments.push(tournament)
  localStorage.setItem("tournaments", JSON.stringify(tournaments))

  // Display the tournament
  displayTournament(tournament, wrestlers, championships)

  // Update tournaments list
  displayTournamentsList(tournaments)

  // Reset form
  document.getElementById("tournamentName").value = ""
  document.getElementById("tournamentDate").value = ""
  document.getElementById("championship").value = "none"

  // Clear wrestler selection
  document.querySelectorAll(".wrestler-item.selected").forEach((item) => {
    item.classList.remove("selected")
  })

  // Update selection count
  updateSelectionCount(0)

  // Disable buttons
  document.getElementById("clearSelection").disabled = true
  document.getElementById("createTournament").disabled = true
}

// Generate matches for tournament
function generateMatches(participants) {
  const rounds = Math.log2(participants)
  const matches = []

  // Generate all rounds
  for (let round = 1; round <= rounds; round++) {
    const matchesInRound = participants / Math.pow(2, round)

    for (let position = 1; position <= matchesInRound; position++) {
      matches.push({
        id: `${round}-${position}`,
        round,
        position,
      })
    }
  }

  return matches
}

// Display tournament
function displayTournament(tournament, wrestlers, championships) {
  // Show active tournament card and hide tournament list
  document.getElementById("activeTournamentCard").style.display = "block"
  document.getElementById("tournamentListCard").style.display = "none"

  // Set tournament title
  document.getElementById("tournamentTitle").textContent = tournament.name

  // Add championship badge if applicable
  if (tournament.championshipId) {
    const championship = championships.find((c) => c.id === tournament.championshipId)
    if (championship) {
      const badge = document.createElement("span")
      badge.className = "badge badge-yellow ml-2"
      badge.textContent = championship.name
      document.getElementById("tournamentTitle").appendChild(badge)
    }
  }

  // Set participant count
  document.getElementById("participantCount").textContent = tournament.participants

  // Render bracket
  renderBracket(tournament, wrestlers, championships)
}

// Render tournament bracket
function renderBracket(tournament, wrestlers, championships) {
  const bracketElement = document.getElementById("tournamentBracket")
  bracketElement.innerHTML = ""

  const rounds = Math.log2(tournament.participants)

  for (let round = 1; round <= rounds; round++) {
    const matchesInRound = tournament.matches.filter((match) => match.round === round)

    const roundElement = document.createElement("div")
    roundElement.className = "bracket-round"

    // Round title
    const roundTitle = document.createElement("h3")
    roundTitle.className = "bracket-round-title"

    if (round === 1) {
      roundTitle.textContent = "First Round"
    } else if (round === 2) {
      roundTitle.textContent = "Quarter Finals"
    } else if (round === 3) {
      roundTitle.textContent = "Semi Finals"
    } else if (round === rounds) {
      roundTitle.textContent = "Finals"
    } else {
      roundTitle.textContent = `Round ${round}`
    }

    roundElement.appendChild(roundTitle)

    // Matches
    matchesInRound.forEach((match) => {
      const matchElement = document.createElement("div")
      matchElement.className = "bracket-match"
      matchElement.setAttribute("data-match-id", match.id)

      const matchWrestlersElement = document.createElement("div")
      matchWrestlersElement.className = "bracket-match-wrestlers"

      // Wrestler 1
      const wrestler1Element = document.createElement("button")
      wrestler1Element.className = `bracket-wrestler ${match.winnerId === match.wrestler1Id ? "winner" : ""}`
      wrestler1Element.textContent = getWrestlerName(match.wrestler1Id, wrestlers)
      wrestler1Element.disabled = !match.wrestler1Id

      if (match.wrestler1Id) {
        wrestler1Element.addEventListener("click", () => {
          setMatchWinner(tournament, match.id, match.wrestler1Id, wrestlers, championships)
        })
      }

      // VS
      const vsElement = document.createElement("div")
      vsElement.className = "bracket-vs"
      vsElement.textContent = "vs"

      // Wrestler 2
      const wrestler2Element = document.createElement("button")
      wrestler2Element.className = `bracket-wrestler ${match.winnerId === match.wrestler2Id ? "winner" : ""}`
      wrestler2Element.textContent = getWrestlerName(match.wrestler2Id, wrestlers)
      wrestler2Element.disabled = !match.wrestler2Id

      if (match.wrestler2Id) {
        wrestler2Element.addEventListener("click", () => {
          setMatchWinner(tournament, match.id, match.wrestler2Id, wrestlers, championships)
        })
      }

      matchWrestlersElement.appendChild(wrestler1Element)
      matchWrestlersElement.appendChild(vsElement)
      matchWrestlersElement.appendChild(wrestler2Element)

      matchElement.appendChild(matchWrestlersElement)

      // Winner display
      if (match.winnerId) {
        const winnerElement = document.createElement("div")
        winnerElement.className = "text-center text-sm text-green-600 mt-2"
        winnerElement.textContent = `Winner: ${getWrestlerName(match.winnerId, wrestlers)}`
        matchElement.appendChild(winnerElement)
      }

      roundElement.appendChild(matchElement)
    })

    bracketElement.appendChild(roundElement)
  }

  // Tournament winner
  if (tournament.completed && tournament.winner) {
    const winnerElement = document.createElement("div")
    winnerElement.className = "tournament-winner"

    const winnerTitleElement = document.createElement("div")
    winnerTitleElement.className = "tournament-winner-title"

    const trophyIcon = document.createElement("span")
    trophyIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>'

    winnerTitleElement.appendChild(trophyIcon)
    winnerTitleElement.appendChild(document.createTextNode(" Tournament Winner"))

    const winnerNameElement = document.createElement("h3")
    winnerNameElement.className = "tournament-winner-name"
    winnerNameElement.textContent = getWrestlerName(tournament.winner, wrestlers)

    winnerElement.appendChild(winnerTitleElement)
    winnerElement.appendChild(winnerNameElement)

    // Championship badge if applicable
    if (tournament.championshipId) {
      const championship = championships.find((c) => c.id === tournament.championshipId)
      if (championship) {
        const badgeElement = document.createElement("div")
        badgeElement.className = "badge badge-yellow mt-2"
        badgeElement.textContent = `New ${championship.name} Champion`
        winnerElement.appendChild(badgeElement)
      }
    }

    bracketElement.appendChild(winnerElement)
  }
}

// Get wrestler name by ID
function getWrestlerName(id, wrestlers) {
  if (!id) return "TBD"
  const wrestler = wrestlers.find((w) => w.id === id)
  return wrestler ? wrestler.name : "Unknown"
}

// Set match winner
function setMatchWinner(tournament, matchId, winnerId, wrestlers, championships) {
  const matchIndex = tournament.matches.findIndex((m) => m.id === matchId)
  if (matchIndex === -1) return

  const match = tournament.matches[matchIndex]
  match.winnerId = winnerId

  // Find the next match
  const nextRound = match.round + 1
  const nextPosition = Math.ceil(match.position / 2)
  const nextMatch = tournament.matches.find((m) => m.round === nextRound && m.position === nextPosition)

  if (nextMatch) {
    // Determine if this wrestler goes to wrestler1 or wrestler2 slot
    if (match.position % 2 === 1) {
      nextMatch.wrestler1Id = winnerId
    } else {
      nextMatch.wrestler2Id = winnerId
    }
  }

  // Check if tournament is completed
  const finalMatch = tournament.matches.find((m) => m.round === Math.log2(tournament.participants))
  let isCompleted = false
  let tournamentWinner = undefined

  if (finalMatch && finalMatch.winnerId) {
    isCompleted = true
    tournamentWinner = finalMatch.winnerId

    // If this is a championship tournament, update the championship holder
    if (tournament.championshipId) {
      updateChampionshipHolder(tournament.championshipId, finalMatch.winnerId)
    }
  }

  tournament.completed = isCompleted
  tournament.winner = tournamentWinner

  // Save updated tournament
  const tournaments = loadTournaments()
  const tournamentIndex = tournaments.findIndex((t) => t.id === tournament.id)
  if (tournamentIndex !== -1) {
    tournaments[tournamentIndex] = tournament
    localStorage.setItem("tournaments", JSON.stringify(tournaments))
  }

  // Re-render bracket
  renderBracket(tournament, wrestlers, championships)
}

// Update championship holder
function updateChampionshipHolder(championshipId, wrestlerId) {
  const championships = loadChampionships()
  const wrestlers = loadWrestlers()

  // Update championship
  const championshipIndex = championships.findIndex((c) => c.id === championshipId)
  if (championshipIndex !== -1) {
    championships[championshipIndex].currentHolder = wrestlerId
    localStorage.setItem("championships", JSON.stringify(championships))
  }

  // Update wrestler's championships
  const wrestlerIndex = wrestlers.findIndex((w) => w.id === wrestlerId)
  if (wrestlerIndex !== -1) {
    if (!wrestlers[wrestlerIndex].championships) {
      wrestlers[wrestlerIndex].championships = []
    }
    if (!wrestlers[wrestlerIndex].championships.includes(championshipId)) {
      wrestlers[wrestlerIndex].championships.push(championshipId)
      localStorage.setItem("wrestlers", JSON.stringify(wrestlers))
    }
  }
}

// Display tournaments list
function displayTournamentsList(tournaments) {
  const tournamentList = document.getElementById("tournamentList")
  tournamentList.innerHTML = ""

  if (tournaments.length === 0) {
    tournamentList.innerHTML =
      '<div class="empty-state">No tournaments created yet. Create your first tournament above.</div>'
    return
  }

  tournaments.forEach((tournament) => {
    const tournamentItem = document.createElement("button")
    tournamentItem.className = "btn-outline full-width justify-between mb-2"
    tournamentItem.setAttribute("data-id", tournament.id)

    const tournamentInfo = document.createElement("div")
    tournamentInfo.className = "flex items-center"

    const tournamentName = document.createElement("span")
    tournamentName.textContent = tournament.name
    tournamentInfo.appendChild(tournamentName)

    if (tournament.completed) {
      const completedBadge = document.createElement("span")
      completedBadge.className = "badge badge-green ml-2"
      completedBadge.textContent = "Completed"
      tournamentInfo.appendChild(completedBadge)
    }

    if (tournament.championshipId) {
      const championshipBadge = document.createElement("span")
      championshipBadge.className = "badge badge-yellow ml-2"
      championshipBadge.textContent = "Championship"
      tournamentInfo.appendChild(championshipBadge)
    }

    tournamentItem.appendChild(tournamentInfo)

    const chevronIcon = document.createElement("span")
    chevronIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>'
    tournamentItem.appendChild(chevronIcon)

    tournamentItem.addEventListener("click", () => {
      const selectedTournament = tournaments.find((t) => t.id === tournament.id)
      if (selectedTournament) {
        const wrestlers = loadWrestlers()
        const championships = loadChampionships()
        displayTournament(selectedTournament, wrestlers, championships)
      }
    })

    tournamentList.appendChild(tournamentItem)
  })
}

// Set up tournament selection
function setupTournamentSelection(tournaments, wrestlers, championships) {
  // Back to tournaments list button
  const backButton = document.createElement("button")
  backButton.className = "btn-outline mb-4"
  backButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> Back to Tournaments'

  backButton.addEventListener("click", () => {
    document.getElementById("activeTournamentCard").style.display = "none"
    document.getElementById("tournamentListCard").style.display = "block"
  })

  document
    .getElementById("activeTournamentCard")
    .insertBefore(backButton, document.getElementById("activeTournamentCard").firstChild)
}

// Setup wrestler management
function setupWrestlerManagement(wrestlers, championships, brands) {
  // Display wrestlers
  displayWrestlers(wrestlers, championships, brands)

  // Add wrestler form
  const addWrestlerBtn = document.getElementById("addWrestler")
  if (addWrestlerBtn) {
    addWrestlerBtn.addEventListener("click", () => {
      const name = document.getElementById("wrestlerName").value
      const alignment = document.getElementById("wrestlerAlignment").value
      const brand = document.getElementById("wrestlerBrand").value
      const photo = document.getElementById("wrestlerPhoto").value

      if (!name) {
        alert("Wrestler name is required")
        return
      }

      const wrestler = {
        id: Date.now().toString(),
        name,
        alignment,
        brand,
        photo,
        finisher: "",
        entranceMusic: "",
        popularity: 50,
        championships: [],
        favoriteMatchType: "",
        record: {
          wins: 0,
          losses: 0,
          draws: 0,
        },
      }

      wrestlers.push(wrestler)
      localStorage.setItem("wrestlers", JSON.stringify(wrestlers))

      // Reset form
      document.getElementById("wrestlerName").value = ""
      document.getElementById("wrestlerPhoto").value = ""

      // Refresh wrestler list
      displayWrestlers(wrestlers, championships, brands)

      // Refresh wrestler selection
      populateWrestlerSelection(wrestlers)
    })
  }
}

// Display wrestlers
function displayWrestlers(wrestlers, championships, brands) {
  const wrestlersList = document.getElementById("wrestlersList")
  if (!wrestlersList) return

  wrestlersList.innerHTML = ""

  if (wrestlers.length === 0) {
    wrestlersList.innerHTML = '<div class="empty-state">No wrestlers found. Add wrestlers to get started.</div>'
    return
  }

  const wrestlerListElement = document.createElement("div")
  wrestlerListElement.className = "wrestler-list"

  wrestlers.forEach((wrestler) => {
    const wrestlerCard = document.createElement("div")
    wrestlerCard.className = "wrestler-card"

    const wrestlerHeader = document.createElement("div")
    wrestlerHeader.className = "wrestler-card-header"

    // Wrestler photo
    if (wrestler.photo) {
      const photo = document.createElement("img")
      photo.className = "wrestler-photo"
      photo.src = wrestler.photo
      photo.alt = wrestler.name
      photo.onerror = () => {
        photo.src = "https://via.placeholder.com/50"
      }
      wrestlerHeader.appendChild(photo)
    } else {
      const photoPlaceholder = document.createElement("div")
      photoPlaceholder.className = "wrestler-photo"
      photoPlaceholder.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
      wrestlerHeader.appendChild(photoPlaceholder)
    }

    // Wrestler name
    const nameElement = document.createElement("div")
    nameElement.className = "wrestler-name"
    nameElement.textContent = wrestler.name
    wrestlerHeader.appendChild(nameElement)

    wrestlerCard.appendChild(wrestlerHeader)

    // Wrestler info
    const infoElement = document.createElement("div")
    infoElement.className = "wrestler-info"

    // Alignment
    const alignmentElement = document.createElement("div")
    alignmentElement.innerHTML = `<strong>Alignment:</strong> ${wrestler.alignment}`
    infoElement.appendChild(alignmentElement)

    // Brand
    const brandElement = document.createElement("div")
    brandElement.innerHTML = `<strong>Brand:</strong> ${wrestler.brand}`
    infoElement.appendChild(brandElement)

    // Record
    const recordElement = document.createElement("div")
    recordElement.innerHTML = `<strong>Record:</strong> ${wrestler.record.wins}-${wrestler.record.losses}-${wrestler.record.draws}`
    infoElement.appendChild(recordElement)

    // Championships
    if (wrestler.championships && wrestler.championships.length > 0) {
      const championshipsElement = document.createElement("div")
      championshipsElement.innerHTML = "<strong>Championships:</strong> "

      wrestler.championships.forEach((championshipId, index) => {
        const championship = championships.find((c) => c.id === championshipId)
        if (championship) {
          const championshipSpan = document.createElement("span")
          championshipSpan.className = "badge badge-yellow"
          championshipSpan.textContent = championship.name
          championshipsElement.appendChild(championshipSpan)

          if (index < wrestler.championships.length - 1) {
            championshipsElement.appendChild(document.createTextNode(", "))
          }
        }
      })

      infoElement.appendChild(championshipsElement)
    }

    wrestlerCard.appendChild(infoElement)

    // Wrestler actions
    const actionsElement = document.createElement("div")
    actionsElement.className = "wrestler-actions"

    // Edit button
    const editButton = document.createElement("button")
    editButton.className = "btn-outline btn-sm"
    editButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'
    editButton.addEventListener("click", () => {
      // Edit wrestler functionality would go here
      alert("Edit wrestler functionality coming soon!")
    })
    actionsElement.appendChild(editButton)

    // Delete button
    const deleteButton = document.createElement("button")
    deleteButton.className = "btn-outline btn-sm"
    deleteButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>'
    deleteButton.addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete ${wrestler.name}?`)) {
        const updatedWrestlers = wrestlers.filter((w) => w.id !== wrestler.id)
        localStorage.setItem("wrestlers", JSON.stringify(updatedWrestlers))
        displayWrestlers(updatedWrestlers, championships, brands)
        populateWrestlerSelection(updatedWrestlers)
      }
    })
    actionsElement.appendChild(deleteButton)

    wrestlerCard.appendChild(actionsElement)

    wrestlerListElement.appendChild(wrestlerCard)
  })

  wrestlersList.appendChild(wrestlerListElement)
}

// Setup championship management
function setupChampionshipManagement(championships, wrestlers) {
  // Display championships
  displayChampionships(championships, wrestlers)

  // Add championship form
  const addChampionshipBtn = document.getElementById("addChampionship")
  if (addChampionshipBtn) {
    addChampionshipBtn.addEventListener("click", () => {
      const name = document.getElementById("championshipName").value
      const division = document.getElementById("championshipDivision").value
      const description = document.getElementById("championshipDescription").value
      const image = document.getElementById("championshipImage").value

      if (!name) {
        alert("Championship name is required")
        return
      }

      const championship = {
        id: Date.now().toString(),
        name,
        division,
        description,
        image,
      }

      championships.push(championship)
      localStorage.setItem("championships", JSON.stringify(championships))

      // Reset form
      document.getElementById("championshipName").value = ""
      document.getElementById("championshipDescription").value = ""
      document.getElementById("championshipImage").value = ""

      // Refresh championship list
      displayChampionships(championships, wrestlers)

      // Refresh championship dropdown
      populateChampionshipDropdown(championships)
    })
  }
}

// Display championships
function displayChampionships(championships, wrestlers) {
  const championshipsList = document.getElementById("championshipsList")
  if (!championshipsList) return

  championshipsList.innerHTML = ""

  if (championships.length === 0) {
    championshipsList.innerHTML =
      '<div class="empty-state">No championships found. Add championships to get started.</div>'
    return
  }

  const championshipListElement = document.createElement("div")
  championshipListElement.className = "championship-list"

  championships.forEach((championship) => {
    const championshipCard = document.createElement("div")
    championshipCard.className = "championship-card"

    // Championship image
    if (championship.image) {
      const image = document.createElement("img")
      image.className = "championship-image"
      image.src = championship.image
      image.alt = championship.name
      image.onerror = () => {
        image.src = "https://via.placeholder.com/80x60"
      }
      championshipCard.appendChild(image)
    } else {
      const imagePlaceholder = document.createElement("div")
      imagePlaceholder.className = "championship-image"
      imagePlaceholder.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>'
      championshipCard.appendChild(imagePlaceholder)
    }

    // Championship info
    const infoElement = document.createElement("div")
    infoElement.className = "championship-info"

    // Championship name
    const nameElement = document.createElement("div")
    nameElement.className = "championship-name"
    nameElement.textContent = championship.name
    infoElement.appendChild(nameElement)

    // Championship description
    const descriptionElement = document.createElement("div")
    descriptionElement.className = "championship-description"
    descriptionElement.textContent = championship.description || "No description available"
    infoElement.appendChild(descriptionElement)

    // Championship holder
    const holderElement = document.createElement("div")
    holderElement.className = "championship-holder"

    if (championship.currentHolder) {
      const holder = wrestlers.find((w) => w.id === championship.currentHolder)
      holderElement.innerHTML = `<strong>Current Holder:</strong> ${holder ? holder.name : "Unknown"}`
    } else {
      holderElement.innerHTML = "<strong>Current Holder:</strong> Vacant"
    }

    infoElement.appendChild(holderElement)

    // Championship actions
    const actionsElement = document.createElement("div")
    actionsElement.className = "championship-actions"

    // Edit button
    const editButton = document.createElement("button")
    editButton.className = "btn-outline btn-sm"
    editButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>'
    editButton.addEventListener("click", () => {
      // Edit championship functionality would go here
      alert("Edit championship functionality coming soon!")
    })
    actionsElement.appendChild(editButton)

    // Delete button
    const deleteButton = document.createElement("button")
    deleteButton.className = "btn-outline btn-sm"
    deleteButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>'
    deleteButton.addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete ${championship.name}?`)) {
        const updatedChampionships = championships.filter((c) => c.id !== championship.id)
        localStorage.setItem("championships", JSON.stringify(updatedChampionships))
        displayChampionships(updatedChampionships, wrestlers)
        populateChampionshipDropdown(updatedChampionships)
      }
    })
    actionsElement.appendChild(deleteButton)

    infoElement.appendChild(actionsElement)

    championshipCard.appendChild(infoElement)

    championshipListElement.appendChild(championshipCard)
  })

  championshipsList.appendChild(championshipListElement)
}

// Star Rating Component
class StarRating {
  constructor(container, initialRating = 0, onChange = () => {}) {
    this.container = container
    this.rating = initialRating
    this.onChange = onChange

    this.render()
  }

  render() {
    this.container.innerHTML = ""
    this.container.className = "star-rating"

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("div")
      star.className = "star"

      if (this.rating >= i) {
        star.classList.add("full")
      } else if (this.rating >= i - 0.5) {
        star.classList.add("half")
      }

      star.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'

      // Left half (for half star)
      const leftHalf = document.createElement("div")
      leftHalf.className = "star-half"
      leftHalf.style.position = "absolute"
      leftHalf.style.top = "0"
      leftHalf.style.left = "0"
      leftHalf.style.width = "50%"
      leftHalf.style.height = "100%"
      leftHalf.style.cursor = "pointer"
      leftHalf.style.zIndex = "1"

      leftHalf.addEventListener("click", () => {
        this.setRating(i - 0.5)
      })

      // Right half (for full star)
      const rightHalf = document.createElement("div")
      rightHalf.className = "star-half"
      rightHalf.style.position = "absolute"
      rightHalf.style.top = "0"
      rightHalf.style.left = "50%"
      rightHalf.style.width = "50%"
      rightHalf.style.height = "100%"
      rightHalf.style.cursor = "pointer"
      rightHalf.style.zIndex = "1"

      rightHalf.addEventListener("click", () => {
        this.setRating(i)
      })

      star.appendChild(leftHalf)
      star.appendChild(rightHalf)

      this.container.appendChild(star)
    }
  }

  setRating(rating) {
    // Toggle between whole and half star if clicking the same value
    if (Math.ceil(this.rating) === Math.ceil(rating) && this.rating % 1 !== 0 && rating % 1 === 0) {
      this.rating = Math.floor(this.rating)
    } else if (Math.ceil(this.rating) === Math.ceil(rating) && this.rating % 1 === 0) {
      this.rating = rating - 0.5
    } else {
      this.rating = rating
    }

    this.render()
    this.onChange(this.rating)
  }
}

