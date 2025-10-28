package ma.ensias.soa.ticketservice.exception;

public class OccupiedSeatException extends RuntimeException {
public OccupiedSeatException(){
    super("the seat is occupied already");
}
public OccupiedSeatException(String message){
    super(message);
}
}
