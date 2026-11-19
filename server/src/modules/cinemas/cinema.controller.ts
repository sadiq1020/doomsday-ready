import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import * as cinemaService from "./cinema.service.js";

// POST /api/cinemas - Create one cinema or array of cinemas
export const createCinemasHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await cinemaService.createCinemas(req.body);
    res.status(201).json(result);
  }
);

// GET /api/cinemas - List all cinemas ordered by name
export const getAllCinemasHandler = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const result = await cinemaService.getAllCinemas();
    res.status(200).json(result);
  }
);

// GET /api/cinemas/:id/booking?groupSize=N
export const getBookingHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const cinemaId = String(req.params.id);
    const groupSize = Number((req.query as any).groupSize);
    const result = await cinemaService.getBooking(cinemaId, groupSize);
    res.status(200).json(result);
  }
);

