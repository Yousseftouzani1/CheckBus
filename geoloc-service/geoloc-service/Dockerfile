# ===============================
# Stage 1 — Build app + simulator
# ===============================
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ===============================
# Stage 2 — Run phase
# ===============================
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/geoloc-service-*.jar app.jar

# (Optional) copy simulator classes if not inside the jar
COPY src/main/java/ma/ensias/soa/geoloc_service/simulator ./simulator

ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar"]
