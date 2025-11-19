# ==============================
# 1. BUILD STAGE
# ==============================
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and download dependencies first (cached layer)
COPY pom.xml .
RUN mvn -q dependency:go-offline -DskipTests || true

# Copy the source code
COPY src ./src

# Build the application
RUN mvn -q clean package -DskipTests

# ==============================
# 2. RUNTIME STAGE
# ==============================
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the auth-service port
EXPOSE 8084

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
