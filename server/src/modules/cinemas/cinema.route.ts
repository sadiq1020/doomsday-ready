import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import {
  postCinemasSchema,
  cinemaIdParamSchema,
  bookingQuerySchema,
} from "./cinema.schema.js";
import {
  createCinemasHandler,
  getAllCinemasHandler,
  getBookingHandler,
} from "./cinema.controller.js";

const router = Router();

// POST /api/cinemas - Create one cinema or array of cinemas
router.post("/", validate(postCinemasSchema), createCinemasHandler);

// GET /api/cinemas - List all cinemas ordered by name
router.get("/", getAllCinemasHandler);

// GET /api/cinemas/:id/booking?groupSize=N
router.get(
  "/:id/booking",
  validate({ params: cinemaIdParamSchema, query: bookingQuerySchema }),
  getBookingHandler
);

export const cinemaRouter = router;

