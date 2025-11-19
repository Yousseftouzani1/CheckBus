# ==============================
# 1. Build Stage
# ==============================
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app

# Copy the pom and resolve dependencies (cached layer)
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Copy source
COPY src ./src

# Build the application
RUN mvn -q clean package -DskipTests

# ==============================
# 2. Runtime Stage
# ==============================
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose service port
EXPOSE 8087

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
