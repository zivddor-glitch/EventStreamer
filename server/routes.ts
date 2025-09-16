import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Session-based authentication middleware  
function requireAdmin(req: any, res: any, next: any) {
  // Check if user has valid admin session
  if (!req.session?.isAdmin) {
    return res.status(401).json({ message: "Unauthorized - Admin login required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication endpoint
  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    
    // Check against admin password from environment
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable not set");
      return res.status(500).json({ message: "Server configuration error" });
    }
    
    if (password !== adminPassword) {
      return res.status(401).json({ message: "Invalid admin password" });
    }

    // Set admin session
    req.session.isAdmin = true;
    res.json({ message: "Login successful" });
  });

  // Check admin session status
  app.get("/api/admin/me", async (req, res) => {
    if (req.session?.isAdmin) {
      res.json({ isAdmin: true });
    } else {
      res.status(401).json({ isAdmin: false });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", async (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Public API - Get published events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getPublishedEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching published events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin API - Get all events
  app.get("/api/admin/events", requireAdmin, async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching all events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin API - Toggle event publish status
  app.post("/api/admin/publish", requireAdmin, async (req, res) => {
    try {
      const { eventId, status } = req.body;
      
      if (!eventId || !status || !['published', 'draft'].includes(status)) {
        return res.status(400).json({ message: "Invalid request body" });
      }

      await storage.updateEventStatus(eventId, status);
      res.json({ message: "Event status updated successfully" });
    } catch (error) {
      console.error("Error updating event status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
