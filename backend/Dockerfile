FROM maven:3.9.11-eclipse-temurin-17-alpine AS build

WORKDIR /build

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S driveme && adduser -S driveme -G driveme

COPY --from=build /build/target/driveme-spring-0.0.1-SNAPSHOT.jar /app/driveme.jar

USER driveme

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/driveme.jar"]
