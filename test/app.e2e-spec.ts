/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import request from 'supertest';
import { AppModule } from './../src/app.module';

import { faker } from '@faker-js/faker/locale/en';
describe('Patients (e2e)', () => {
  let app: INestApplication;
  let patientId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
  });

  it('/patients (POST) - Success', () => {
    const uniqueName = `${faker.person.fullName()} ${faker.string.alphanumeric(5)}`;
    const uniqueEmail = faker.internet.email({
      firstName: faker.string.alphanumeric(10),
    });
    const medicine = `${faker.science.chemicalElement().name}ix`;
    return request(app.getHttpServer())
      .post('/patients')
      .send({
        name: uniqueName,
        email: uniqueEmail,
        dob: '1984-08-20',
        prescriptions: [
          {
            medicationName: medicine,
            dosage: '500mg',
            date: faker.date.future().toISOString().split('T')[0],
          },
        ],
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        patientId = +res.body.id;
        expect(res.body.name).toEqual(uniqueName);
        expect(res.body.email).toEqual(uniqueEmail);
        expect(res.body.prescriptions).toHaveLength(1);
        expect(res.body.prescriptions[0].medicationName).toBe(medicine);
      });
  });

  // Tarea 4: Probar paginación
  it('/patients (GET) - Pagination', () => {
    return request(app.getHttpServer())
      .get('/patients?limit=10&offset=0')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('meta');
      });
  });

  it('/patients/:id (GET) - Success', () => {
    return request(app.getHttpServer())
      .get(`/patients/${patientId}`)
      .expect(200)
      .expect((res) => {
        expect(+res.body.id).toEqual(patientId);
      });
  });
  it('/patients/:id (PATCH) - Success', () => {
    const updatedData = { name: 'Updated Patient Name' };
    return request(app.getHttpServer())
      .patch(`/patients/${patientId}`)
      .send(updatedData)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toEqual(updatedData.name);
      });
  });
  it('/patients/:id (DELETE) - Success', () => {
    console.log({ patientId });
    return request(app.getHttpServer())
      .delete(`/patients/${patientId}`)
      .expect(200);
  });

  it('/patients/:id (GET) - Not Found after deletion', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await request(app.getHttpServer()).get(
      `/patients/${patientId}`,
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toContain(`id: ${patientId} was not found`);
  });

  afterAll(async () => {
    await app.close();
  });
});
