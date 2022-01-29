import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { routes } from './src/routes/images';
import { initImages } from './src/middleware/imagesMiddleware';

dotenv.config();

const app = express();
const views = path.join(process.cwd(), 'src', 'views');

app.use(express.json());
app.use(express.static(path.resolve(process.cwd(), 'uploads', 'full')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(initImages);

app.get('/', (req: Request, res: Response): void => {
  res.render("index")
});

app.use('/images', routes);

export default app;