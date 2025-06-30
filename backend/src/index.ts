import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import candidateRoutes from './routes/candidates';
import path from 'path';
import fs from 'fs';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});
app.get('/uploads/cvs/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../../uploads/cvs', req.params.filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      res.type('application/pdf');
    }
    res.sendFile(filePath);
  } else {
    res.status(404).send('Archivo no encontrado');
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Servir archivos estáticos
app.use('/api/candidates', candidateRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
