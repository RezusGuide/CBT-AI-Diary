# Stage 1: Build the Java application
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app

# Copy the entire project into the Docker container
COPY . .

# Make the Gradle wrapper executable and build the Spring Boot application
RUN chmod +x ./gradlew
RUN ./gradlew clean bootJar -x test

# Stage 2: Create the lightweight production image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built jar files from the builder stage
COPY --from=builder /app/build/libs/*.jar /app/

# Expose the web port
EXPOSE 8080

# Find and run the Spring Boot executable jar (ignoring the lightweight -plain.jar)
ENTRYPOINT ["sh", "-c", "java -jar $(find . -maxdepth 1 -name '*.jar' -not -name '*plain.jar' | head -n 1)"]