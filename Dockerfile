FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew clean bootJar -x test

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar /app/
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar $(find . -maxdepth 1 -name '*.jar' -not -name '*plain.jar' | head -n 1)"]
