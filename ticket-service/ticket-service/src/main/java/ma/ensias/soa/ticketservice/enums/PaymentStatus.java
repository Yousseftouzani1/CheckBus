package ma.ensias.soa.ticketservice.enums;

public enum PaymentStatus {
    PENDING("Payment initiated, waiting for confirmation"),
    SUCCESS("Payment completed successfully"),
    FAILED("Payment failed, please try again"),
    REFUNDED("Payment refunded to the user");

    private final String description;

    PaymentStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
 