const { createServer } = require("https")
const { parse } = require("url")
const next = require("next")
const fs = require("fs")
const path = require("path")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 8080 // Using 8080 as the recommended port for IONOS

// Create a simple middleware to handle errors
const errorHandler = (err, req, res) => {
  console.error("Error occurred handling request:", err)

  // Check if headers have already been sent
  if (res.headersSent) {
    return
  }

  res.statusCode = 500
  res.setHeader("Content-Type", "text/html")
  res.end("<h1>Internal Server Error</h1><p>Sorry, there was a problem</p>")
}

// Create a simple middleware to log requests
const requestLogger = (req, res, next) => {
  const { method, url } = req
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start
    console.log(`${method} ${url} ${res.statusCode} - ${duration}ms`)
  })

  next()
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Set CORS headers to prevent 403 errors
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")

    // Handle OPTIONS method for preflight requests
    if (req.method === "OPTIONS") {
      res.statusCode = 200
      res.end()
      return
    }

    // Parse the URL
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    // Check for static files in the public directory
    const publicFiles = ["favicon.ico", "robots.txt", "sitemap.xml"]
    const isPublicFile = publicFiles.some((file) => pathname === `/${file}`)

    if (isPublicFile) {
      const filePath = path.join(__dirname, "public", pathname)
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          // File exists, serve it
          const stream = fs.createReadStream(filePath)
          stream.pipe(res)
        } else {
          // File doesn't exist, let Next.js handle it
          handle(req, res, parsedUrl)
        }
      })
      return
    }

    // Let Next.js handle all other requests
    handle(req, res, parsedUrl)
  })

  // Add error handling
  server.on("error", (err) => {
    console.error("Server error:", err)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

