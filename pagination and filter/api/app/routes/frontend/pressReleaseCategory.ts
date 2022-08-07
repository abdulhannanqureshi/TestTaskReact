import express from "express";

import {
  getPressReleaseCategory,
  viewPressReleaseCategory,
} from "../../controllers/frontend";
const PressReleaseCategoryRouter: express.Router = express.Router();

PressReleaseCategoryRouter.get("/", getPressReleaseCategory);
PressReleaseCategoryRouter.get("/:id", viewPressReleaseCategory);

export default PressReleaseCategoryRouter;
