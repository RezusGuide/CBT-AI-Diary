# Deployment Guide for CBT AI Diary

This document explains how to deploy the CBT AI Diary project to production using Neon (PostgreSQL), Railway (Backend), and Vercel (Frontend).

## 1. Database: Neon (PostgreSQL)

1. Create a project at [Neon.tech](https://neon.tech/).
2. Get your connection string. It should look like this: `postgres://user:password@ep-host.region.aws.neon.tech/neondb?sslmode=require`
3. Convert it to a JDBC URL for Spring Boot: `jdbc:postgresql://ep-host.region.aws.neon.tech/neondb?sslmode=require`

## 2. Backend: Railway

1. Login to [Railway.app](https://railway.app/).
2. Create a new project and select **Deploy from GitHub repo**.
3. Choose the `final` branch of your repository.
4. Railway should detect the `Dockerfile` or use the `Procfile` provided.
5. **CRITICAL:** Add the following Environment Variables in Railway:
   - `PORT`: `8080` (Railway will usually override this automatically)
   - `SPRING_DATASOURCE_URL`: (Your JDBC URL from Neon)
   - `SPRING_DATASOURCE_USERNAME`: (Your Neon username)
   - `SPRING_DATASOURCE_PASSWORD`: (Your Neon password)
   - `OPENAI_API_KEY`: (Your OpenAI API key)
   - `OPENAI_MODEL`: `gpt-4o`

## 3. Frontend: Vercel

1. Login to [Vercel.com](https://vercel.com/).
2. Create a new project and select **Import** from your GitHub repo.
3. Set the **Root Directory** to `frontend`.
4. In the **Environment Variables** section, add:
   - `VITE_API_URL`: (The public URL of your Railway backend, e.g., `https://cbt-ai-diary-production.up.railway.app`)
5. Click **Deploy**.

## 4. Manual Verification Steps

1. **Backend Build:** Run `./gradlew bootJar` locally to ensure the JAR file is generated correctly in `build/libs/`.
2. **Frontend Build:** Run `cd frontend && npm install && npm run build` to ensure the Vite production build works.
3. **CORS:** The backend is configured to allow all origins in production for simplicity. If you want more security, update `WebConfig.java` to only allow your Vercel domain.

## Project Structure Summary

- `src/main/resources/application.properties`: Production-ready with environment variable placeholders.
- `system.properties`: Forces Java 17 on Railway.
- `Procfile`: Command to start the application.
- `frontend/src/api.js`: Centralized API URL handler using `VITE_API_URL`.
