# Используем образ с Gradle и JDK 17 для сборки
FROM gradle:8.2.1-jdk17 AS builder

WORKDIR /app

# Копируем gradle файлы для кэширования
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Копируем исходники
COPY src src

# Собираем jar
RUN ./gradlew clean bootJar --no-daemon

# Финальный образ — только JDK для запуска (JDK 17)
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Копируем собранный jar из билдера и сразу переименовываем в app.jar
COPY --from=builder /app/build/libs/*.jar ./app.jar

# Открываем порт
EXPOSE 8080

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "app.jar"]
