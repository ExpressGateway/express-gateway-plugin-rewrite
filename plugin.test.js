const axios = require('axios').default;
const path = require('path');
const gateway = require('express-gateway');
const express = require('express');

let Application = undefined;
let axiosInstance = undefined;

beforeAll((done) => {
  axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/',
    validateStatus: (status) => status < 400
  });

  const app = express();
  const hello = (req, res) => res.status(200).send('Hello!');

  app.get('/status/:code', (req, res) => res.sendStatus(req.params.code));
  app.get('/src/js/*', hello);
  app.get('/api/v1/*', hello)

  Application = app.listen(8081, done);

});

afterAll((done) => {
  Application.close(done);
})

describe('Route path', () => {
  it('should receive a redirect response', () => {
    return axiosInstance
      .get('/tina/318', { maxRedirects: 0 })
      .then((response) => {
        expect(response.status).toBe(301);
        expect(response.headers).toHaveProperty('location', '/status/318');
      });
  });

  it('should redirect to the correct resource', () => {
    return axiosInstance
      .get('/tina/318')
      .then((response) => {
        expect(response.status).toBe(318);
      });
  });

  it('should receive a redirect response', () => {
    return axiosInstance
      .get('/api/users/nick', { maxRedirects: 0 })
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});

describe('RegExp path', () => {
  it('should redirect to the correct resource', () => {
    return axiosInstance
      .get('/js/resource.js')
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});

describe('Non existing path', () => {
  it('should preserve the not found status code', () => {
    expect.assertions(1);
    return expect(axiosInstance.get('/css/resource.css')).rejects.toBeDefined();
  });
});
