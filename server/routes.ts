import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Simple authentication middleware
function requireAdmin(req: any, res: any, next: any) {
  // For now, check for a simple admin token in headers
  // In production, this would be a proper JWT or session system
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== 'admin123') {
    return res.status(401).json({ message: "Unauthorized - Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
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
