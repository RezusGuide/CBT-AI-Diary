# Stage 1: Build
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew clean bootJar -x test

# Stage 2: Final
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Explicitly copy the jar (replace 'diploma-0.0.1-SNAPSHOT.jar' with your actual jar name if different)
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]