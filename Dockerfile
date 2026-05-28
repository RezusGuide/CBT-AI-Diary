# Stage 1: Build the Java application
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
# Copy the gradle files and source code
COPY . .
# Make sure gradlew is executable
RUN chmod +x ./gradlew
# Build the project (skipping tests for speed)
RUN ./gradlew clean bootJar -x test

# Stage 2: Create the production image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy the built jar from the builder stage
# We use a wild-card to find the file regardless of the version number
COPY --from=builder /app/build/libs/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]