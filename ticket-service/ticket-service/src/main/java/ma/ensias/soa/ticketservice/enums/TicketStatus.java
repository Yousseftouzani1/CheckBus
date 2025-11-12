package ma.ensias.soa.ticketservice.enums;

// Enumeration for the ticket status 
public enum TicketStatus {
RESERVED("tiecket is reserved not yet paid"),
PAID("paid ticked"),
VALIDATED("validated ticket(used or scanned)"),
EXPIRED("no more usefull"),
CANCELLED("cancelled ticket"),
FREE("free seat not yet occupied"),
CHANGED("user modified the seat or smth like that ");
private final  String description ; 

private TicketStatus(String description ){
    this.description=description;
}
public String getDescription() {
    return description;
}


}
