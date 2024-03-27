import express from 'express'
import Ticket, {generateSlug} from '../models/ticket.model';
import ReplyThread from '../models/replyThread.model';
import { log } from 'console';

// import { query, validationResult } from 'express-validator';

/**
 * Takes in request from the express server and calls the appropriate services to perform the CRUD
 * actions associated with the request (GET, POST, PATCH, etc.). It then responds with the data
 *  requested or success/error messaging
 */


class TicketsController {
    static async listTickets(req:express.Request, res: express.Response) {

        try {
        const properties = await Ticket.findAll();
        res.json(properties);
        } catch (error) {
        res.status(500).send('Error retrieving properties.');
        }
    }

  static async getTicketBySlug(req: express.Request, res: express.Response) {
    if (!req.params.ticketSlug) {
      res.status(400).send(new Error(`Inavlid slug supplied`));
      return;
    }
    const ticket = await Ticket.findOne(
      {
        where: {
          slug: req.params.ticketSlug
        },
        include:
          {
            model: ReplyThread,
            as: 'Replies'
          }
      }
    ); 
    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).send('Ticket not found.');
    }
  }

  static async updateTicket(req: express.Request, res: express.Response) {
    try {
      const ticket = await Ticket.findByPk(req.params.ticketId);
      if (!ticket) {
        res.status(404).send('Ticket not found.');
      }
      ticket.update(req.body);
      res.json(ticket);
    } catch (error) {
      console.log(error)
      res.status(400).send('Error updating ticket.');
    }
  }

  static async createTicket(req: express.Request, res: express.Response) {
    try {
      const ticket = await Ticket.create({...req.body, slug: generateSlug(req.body.title)});
      res.json(ticket);
    } catch (error) {
      console.log(error)
      res.status(400).send('Error creating ticket.');
    }
  }

  static async replyToTicket(req: express.Request, res: express.Response) {
    try {
      const ticket = await Ticket.findByPk(req.params.ticketId);
      if (!ticket) {
        res.status(404).send('Ticket not found.');
      }
      if(req.body.newStatus) {
        ticket.update({status: req.body.newStatus});
      }
      const reply = await ReplyThread.create(req.body);
      res.json(reply);
        
    } catch (error) {
      console.log(error)
      res.status(400).send('Error replying to ticket.');
    }
  }

}

export default TicketsController