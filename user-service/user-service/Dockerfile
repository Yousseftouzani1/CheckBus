# ==============================
# 1. Build Stage
# ==============================
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven config & download dependencies first (cached)
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Copy source code
COPY src ./src

# Build jar
RUN mvn -q clean package -DskipTests

# ==============================
# 2. Runtime Stage
# ==============================
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy built jar file
COPY --from=build /app/target/*.jar app.jar

# Expose port used in docker-compose
EXPOSE 8082

# Run
ENTRYPOINT ["java", "-jar", "app.jar"]
