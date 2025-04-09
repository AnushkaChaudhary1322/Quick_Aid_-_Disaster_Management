import express from 'express';
import { getShelterFromCSV } from '../controllers/shelterCSVController.js';

const router = express.Router();

router.get('/csv-shelters/:id', getShelterFromCSV);

export default router;
