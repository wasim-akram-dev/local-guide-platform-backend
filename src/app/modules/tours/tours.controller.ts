import { Request, Response } from "express";
import { TourService } from "./tours.service";

const createTour = async (req: Request & { user?: any }, res: Response) => {
  const result = await TourService.createTour(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Tour created successfully",
    data: result,
  });
};

const getAllTours = async (req: Request, res: Response) => {
  const result = await TourService.getAllTours();

  res.json({
    success: true,
    message: "Tours fetched successfully",
    data: result,
  });
};

const getSingleTour = async (req: Request, res: Response) => {
  const result = await TourService.getSingleTour(req.params.id);

  if (!result)
    return res.status(404).json({ success: false, message: "Tour not found" });

  res.json({
    success: true,
    message: "Tour fetched successfully",
    data: result,
  });
};

const updateTour = async (req: Request & { user?: any }, res: Response) => {
  const updated = await TourService.updateTour(
    req.params.id,
    req.body,
    req.user.id
  );

  if (!updated.count)
    return res.status(403).json({ success: false, message: "Not allowed" });

  res.json({ success: true, message: "Tour updated successfully" });
};

const deleteTour = async (req: Request & { user?: any }, res: Response) => {
  const deleted = await TourService.deleteTour(req.params.id, req.user.id);

  if (!deleted.count)
    return res.status(403).json({ success: false, message: "Not allowed" });

  res.json({ success: true, message: "Tour deleted successfully" });
};

export const TourController = {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};
