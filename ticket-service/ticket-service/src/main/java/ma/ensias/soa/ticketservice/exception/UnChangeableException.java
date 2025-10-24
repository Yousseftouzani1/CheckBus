package ma.ensias.soa.ticketservice.exception;

public class UnChangeableException extends RuntimeException {
public UnChangeableException(){
    super("Cannot modify a validated or expired ticket.");
}
public UnChangeableException(String message){
super(message);
}
}
