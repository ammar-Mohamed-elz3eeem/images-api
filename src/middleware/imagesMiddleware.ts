import Express from 'express';
import path from 'path';
import fsp from 'fs/promises';
import { sharpResize, convertToBuffer, saveImageToThumbs } from '../utils/common';

export const imagesPath = path.resolve(process.cwd(), 'uploads', 'full');
export const thumbnailsPath = path.resolve(process.cwd(), 'uploads', 'thumbs');

interface Image {
    img: string,
    idx: number
}

const initImages = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const images: Image[] = [];
  try {
    if (images.length === 0) {
      const imgs = await fsp.readdir(imagesPath);
      imgs.forEach((img, idx) => {
        let imgName = img.slice(0,img.lastIndexOf('.'));
        images.push({img: imgName,idx});
      });
      res.locals.someimgs = images;
      next();
    }
  } catch (error) {
    res.end("No Images Found in the full folder")
  }
};

// const saveImgToThumbs = (
//     req: Express.Request,
//     res: Express.Response,
//     next: Express.NextFunction
// ) => {
//     const width: number = parseInt(req.query.width as string)
//     const height: number = parseInt(req.query.height as string)
//     const imageFile = path.resolve(imagesPath, req.query.filename + '.jpg')
//     const thumbImage = path.resolve(thumbnailsPath, `${req.query.filename}_${req.query.width}_${req.query.height}.jpg`)
//     console.log(thumbImage);
//     fs.access(thumbImage).catch(() => {
//         sharp(imageFile)
//             .resize(width, height)
//             .toFile(thumbImage)
//     })
//     next()
// }

const checkForParams = async (
  req: Express.Request,
  res: Express.Response,
) => {
  if(Object.entries(req.query).length > 0) {
    const thumbImage = path.resolve(thumbnailsPath, `${req.query.filename}_${req.query.width}_${req.query.height}.jpg`);
    fsp.stat(thumbImage).then(async () => {
      const image = await convertToBuffer(thumbImage);
      res.end(image);
    }).catch(async (e) => {
      try {
        await saveImageToThumbs(path.resolve(imagesPath, req.query.filename as string + ".jpg"), req.query.width as string, req.query.height as string, thumbImage);
        const resizedImg = await sharpResize(path.resolve(imagesPath, req.query.filename as string + ".jpg"), req.query.width as string, req.query.height as string);
        res.end(resizedImg);
      } catch (error) {
        res.end("you need to specify valid dimensions and choose image to perform resize opertion on")
      }
    });
  } else {
    res.render('images', {images: res.locals.someimgs});
  }
};

export {
  // saveImgToThumbs,
  initImages,
  checkForParams
};
