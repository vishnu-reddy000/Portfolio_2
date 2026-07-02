# M. Vishnu Vardhan Reddy - Portfolio Application

A modern, responsive full-stack portfolio application built with a Java/Spring Boot backend, Thymeleaf templates, MySQL database, and Cloudinary cloud storage integration.

---

## 🚀 Features

- **Dynamic Content**: Portfolio content (About, Experience, Projects, Skills) is served dynamically from a MySQL database.
- **Admin Dashboard**: Secure control panel at `/admin` to update profile information, manage skills, experiences, and project entries.
- **WebSocket Synchronization**: Live UI updates broadcasted via WebSocket without requiring page reloads when the admin updates data.
- **Media Uploads**: Seamless image uploads for projects and avatars integrated with Cloudinary.
- **Interactive Contact Form**: Direct email inquiries routed via EmailJS SDK integration.
- **Modern Theme System**: Smooth light/dark mode persistence.

---

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:
- **Java JDK 17** or higher (Java 26 supported)
- **Maven 3.8+** (or use the included Maven wrapper `mvnw`)
- **MySQL Server 8.0+**
- **Docker Desktop** (optional, for containerized run)

---

## ⚙️ Configuration

The database and asset configuration can be managed via files or environment variables.

### Local Properties (`src/main/resources/application.properties`)
Configured to use a local MySQL server:
- **Database URL**: `jdbc:mysql://localhost:3306/portfoliodb?createDatabaseIfNotExist=true`
- **Username**: `root`
- **Password**: `root`

### Environment Variables (Recommended for Production)
When deploying to cloud providers or Docker, configure the following environment variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | MySQL Connection URL | `jdbc:mysql://db:3306/portfoliodb` |
| `SPRING_DATASOURCE_USERNAME`| MySQL Username | `root` |
| `SPRING_DATASOURCE_PASSWORD`| MySQL Password | `root` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Name | `dp08coqkk` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `184743115714473` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret Key | *(Secure Secret)* |

---

## 🏃 Running the Application Locally

### Method 1: Running with Local Maven & MySQL

1. **Start your local MySQL database** and ensure it is listening on port `3306`.
2. **Create the database** `portfoliodb` (or let Spring Boot create it automatically on start).
3. **Navigate to the backend directory** and run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. **Access the application**:
   - Homepage: [http://localhost:8080/](http://localhost:8080/)
   - Admin Dashboard: [http://localhost:8080/admin](http://localhost:8080/admin)

### Method 2: Running with Docker Compose

If you have Docker Desktop installed, you can spin up both MySQL and the Spring Boot application using a single command:

1. **Run Docker Compose**:
   ```bash
   docker-compose up --build -d
   ```
2. **Check container status**:
   ```bash
   docker-compose ps
   ```
3. **Shut down services**:
   ```bash
   docker-compose down
   ```

---

## ☁️ Cloud Deployment Guidelines

This application can be deployed to any major cloud provider (e.g., Render, Heroku, AWS, or Azure).

### Step-by-Step for Render / Heroku / Web Hosting
1. **Set Up a Managed MySQL Database**: Spin up a database instance on services like Aiven, Clever Cloud, or AWS RDS.
2. **Set Environment Variables**: In your host's dashboard, configure the required Environment Variables listed in the [Configuration](#-configuration) table.
3. **Configure Build Commands**:
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
