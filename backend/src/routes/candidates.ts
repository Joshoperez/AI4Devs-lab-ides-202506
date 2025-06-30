import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// Crear candidato
router.post('/', upload.single('cv'), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, education, workExperience } = req.body;
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: 'Campos obligatorios faltantes.' });
    }
   const candidate = await prisma.candidate.create({
  data: {
    firstName,
    lastName,
    email,
    phone,
    address,
    education,
    workExperience,
    cvUrl: req.file ? `/uploads/cvs/${req.file.filename}` : null,
  }
});
    res.status(201).json({ message: 'Candidato añadido exitosamente.', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear candidato.', error });
  }
});

// Obtener todos los candidatos
router.get('/', async (req, res) => {
   try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 5;
    const skip = (page - 1) * pageSize;

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.candidate.count(),
    ]);

    res.json({ candidates, total });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener candidatos', error });
  }
});

export default router;