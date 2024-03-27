import { CommonRoutesConfig } from "../common/common.routes";
import express from "express";
import TicketsController from "../controller/tickets.controller";

export class TicketsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "TicketsRoutes");
  }

  configureRoutes(): express.Application {
    this.app.route("/tickets").get(TicketsController.listTickets);
    this.app.route("/tickets/:ticketSlug").get(TicketsController.getTicketBySlug);
    this.app.route("/tickets/create").post(TicketsController.createTicket);
    this.app.route("/tickets/:ticketId/reply").post(TicketsController.replyToTicket);

    return this.app;
  }
}