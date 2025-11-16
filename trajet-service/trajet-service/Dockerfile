# ====== BUILD STAGE ======
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy POM and resolve dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and package
COPY src ./src
RUN mvn clean package -DskipTests && ls -l target

# ====== RUNTIME STAGE ======
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8083

# Activate docker profile
ENV SPRING_PROFILES_ACTIVE=docker

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
