# ====== BUILD STAGE ======
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy POM first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests && ls -l target

# ====== RUNTIME STAGE ======
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy the built artifact
COPY --from=build /app/target/*.jar app.jar

# Expose application port
EXPOSE 8081

# Active profile for Docker
ENV SPRING_PROFILES_ACTIVE=docker

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
