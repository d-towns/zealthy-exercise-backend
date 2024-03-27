import request from 'supertest';
import express from 'express';
import { TicketsRoutes } from '../routes/tickets.routes'; 
import TicketsController from '../controller/tickets.controller';  

jest.mock('../controller/tickets.controller', () => ({
  listTickets: jest.fn((req, res) => res.status(200).send([])),
  getTicketBySlug: jest.fn((req, res) => res.status(200).send({ slug: req.params.ticketSlug })),
  createTicket: jest.fn((req, res) => res.status(201).send(req.body)),
  updateTicket: jest.fn((req, res) => res.status(200).send({ ...req.body, id: req.params.ticketId })),
  replyToTicket: jest.fn((req, res) => res.status(201).send(req.body)),
}));

describe('TicketsRoutes', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    const routes = new TicketsRoutes(app);
    routes.configureRoutes();
  });

  test('GET /tickets', async () => {
    const response = await request(app).get('/tickets');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('GET /tickets/:ticketSlug', async () => {
    const slug = 'test-slug';
    const response = await request(app).get(`/tickets/${slug}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('slug', slug);
  });

  test('POST /tickets/create', async () => {
    const ticketData = { title: 'New Ticket', description: 'Ticket description' };
    const response = await request(app).post('/tickets/create').send(ticketData);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(ticketData);
  });

  test('PUT /tickets/:ticketId', async () => {
    const ticketId = '1';
    const updatedData = { title: 'Updated Title' };
    const response = await request(app).put(`/tickets/${ticketId}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...updatedData, id: ticketId });
  });

  test('POST /tickets/:ticketId/reply', async () => {
    const ticketId = '1';
    const replyData = { message: 'Reply message' };
    const response = await request(app).post(`/tickets/${ticketId}/reply`).send(replyData);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(replyData);
  });

});
