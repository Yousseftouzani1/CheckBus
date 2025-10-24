package ma.ensias.soa.ticketservice.exception;

/**
 * Exception thrown when a ticket cannot be found in the database.
 * Typically used in service or controller layers.
 */
public class TicketNotFoundException extends RuntimeException {

    public TicketNotFoundException() {
        super("Ticket not found.");
    }

    public TicketNotFoundException(Long ticketId) {
        super("Ticket with ID " + ticketId + " not found.");
    }

    public TicketNotFoundException(String message) {
        super(message);
    }
}
