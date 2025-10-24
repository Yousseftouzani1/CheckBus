package ma.ensias.soa.ticketservice.exception;


public class NoSeatsAvailableException extends RuntimeException {
    
    public NoSeatsAvailableException() {
        super(" this seat is occupied or reserved ! ");
    }

    public NoSeatsAvailableException(String message) {
        super(message);
    }
}

