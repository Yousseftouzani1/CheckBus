# ==============================
# 1. BUILD STAGE
# ==============================
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom first for cached dependencies
COPY pom.xml .

# Download dependencies
RUN mvn -q dependency:go-offline -DskipTests || true

# Copy full project
COPY src ./src

# Build JAR
RUN mvn -q clean package -DskipTests

# ==============================
# 2. RUNTIME STAGE
# ==============================
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose service port
EXPOSE 8084

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
