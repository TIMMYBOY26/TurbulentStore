import express from "express";
import {
  addShow,
  listShows,
  singleShow,
  removeShow,
  updateShow,
} from "../controllers/showController.js";
import upload from "../middleware/multer.js";

const showRouter = express.Router();

showRouter.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  addShow,
);

showRouter.get("/list", listShows);
showRouter.get("/:id", singleShow);
showRouter.post("/remove", removeShow);
showRouter.post("/update", updateShow);

export default showRouter;
