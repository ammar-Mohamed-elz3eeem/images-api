import Router, {Request, Response} from 'express';
import { imagesPath, initImages, checkForParams } from '../middleware/imagesMiddleware';
import multer from 'multer';
import path from 'path';

export const routes = Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, imagesPath); },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage});

routes.use(initImages);

// routes.use("/", saveImgToThumbs);

routes.get('/', checkForParams,async (req: Request, res: Response) => {
  res.render('images', {images: res.locals.someimgs});
});

routes.get('/upload_image', (req: Request, res: Response)=>{
  res.render('upload_image');
});

routes.get('/:idx', (req, res) => {
  const singleImg = res.locals.someimgs[parseInt(req.params.idx)];
  res.render('single_image', {singleImg});
});

routes.post('/upload_image', upload.single('imageUrl'), (req: Request, res: Response)=>{
  res.render('upload_image');
});