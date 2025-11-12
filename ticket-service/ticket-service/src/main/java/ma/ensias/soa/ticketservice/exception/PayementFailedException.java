package ma.ensias.soa.ticketservice.exception;

public class PayementFailedException extends RuntimeException {
public PayementFailedException(){
    super("payement failed ! ! ! ");
}

public PayementFailedException(String message ){
    super(message);
}
}
