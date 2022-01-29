import app from '../../app';
import { routes } from '../routes/images';
import supertest from 'supertest';
import fsp from 'fs/promises';
import { resolve } from 'path';
import { sharpResize } from '../utils/common';
import { imagesPath, thumbnailsPath } from '../middleware/imagesMiddleware';
import url from 'url';
import { resolve as pres } from 'path';

describe('Testing the images endpoint', function () {
  it('returns 200', async function () {
    // status code should be 200 `OK`
    await supertest(app)
      .get('/images')
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });

  it('returns the image with specified dimentions', async () => {
    const thumbImg = resolve(process.cwd(), 'uploads', 'thumbs');
    await supertest(app)
      .get('/images/')
      .query({
        filename: 'fjord.jpg',
        width: '110',
        height: '120'
      })
      .then(async () => {
        expect(await fsp.readdir(thumbImg)).toContain('fjord.jpg_110_120.jpg');
      });
  });
});

describe('Test the upload_image endpoint', () => {
  it('should post the image and add it to the uploads/full folder', async () => {
    const data = {
      imageUrl: 'jford.jpg'
    };
    await supertest(routes)
      .post('/upload_image')
      .send(data)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
      });
  });

  it('should print the views for the form', async () => {
    await supertest(routes)
      .get('/upload_image')
      .then((res) => {
        expect(res.statusCode).toEqual(200);
      });
  });
});

describe('Test Case for sharpResize Function', () => {
  it("shouldn't throw an error", async () => {
    const filename = pres(imagesPath, 'fjord.jp');
    // await expect( async function() { await sharpResize(filename, "aq", "100") } ).toThrowError("Invalid File name or Dimensions")
    await expectAsync(sharpResize(filename, '200', '100')).toBeRejected();
  });
  it('width and height need to be positive numbers', async () => {
    const filename = pres(imagesPath, 'fjord.jpg');
    // await expect( async function() { await sharpResize(filename, "aq", "100") } ).toThrowError("Invalid File name or Dimensions")
    await expectAsync(sharpResize(filename, '-200', '100')).toBeRejected();
  });
});
