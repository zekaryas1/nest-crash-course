import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CoffesModule } from '../../src/coffes/coffes.module';
import * as request from 'supertest';
import { CreateCoffeDto } from 'src/coffes/dto/create-coffe.dto';

describe('CoffesController (e2e)', () => {
  let app: INestApplication;
  const body: CreateCoffeDto = {
    name: 'Coffe 1',
    brand: 'Espresso',
    flavours: ['Americano', 'Cappuccino', 'Espresso'],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoffesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /api/coffes', async () => {
    return request(app.getHttpServer())
      .post('/coffes')
      .send(body)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('flavours');
      });
  });

  it('GET /api/coffes', () => {
    return request(app.getHttpServer())
      .get('/coffes')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('GET /coffes/:id', () => {
    return request(app.getHttpServer())
      .get('/coffes/1')
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('brand');
        expect(res.body).toHaveProperty('flavours');
      });
  });

  it('PATCH /api/coffes/:id', () => {
    return request(app.getHttpServer())
      .patch('/coffes/1')
      .send({
        id: 1,
        name: 'Coffe 1: updated',
        brand: 'Espresso: updated',
        flavours: ['Americano 1', 'Cappuccino 2', 'Espresso 3'],
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toEqual({
          id: 1,
          name: 'Coffe 1: updated',
          brand: 'Espresso: updated',
          flavours: ['Americano 1', 'Cappuccino 2', 'Espresso 3'],
        })
      });
  });
  it('DELETE /api/coffes/:id', () => {
    return request(app.getHttpServer())
      .delete('/coffes/1')
      .expect(HttpStatus.NO_CONTENT);
  });

  afterAll(async () => {
    await app.close();
  });
});
