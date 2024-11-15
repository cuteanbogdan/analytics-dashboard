# NextGen Analytics Platform

The **NextGen Analytics Platform** is a full-stack, real-time application designed to provide comprehensive website performance analytics, offering insights into traffic, page views, sessions, and more.

## Project Components

This project is organized into a monorepo with multiple services:

- **Frontend Service:** The frontend service is responsible for delivering a user-friendly and visually appealing interface. It includes dashboards for monitoring website performance, detailed insights pages, and tools for managing tracking scripts.
- **Auth Service:** Handles user authentication and security, including access token generation and validation.
- **Analytics Service:** Retrieves pre-processed traffic data directly from the database and serves it to the user via a GraphQL API. This service acts as the intermediary between the database and the frontend, ensuring efficient data access and secure delivery.
- **Tracking Service:** Handles real-time tracking and data collection through unique scripts embedded in users' websites.
- **Data Processing Service:** Processes raw data received from the tracking service, normalizing, filtering, and storing it efficiently in the database for analytics purposes.

## Architecture

The platform follows a microservices architecture to ensure scalability, maintainability, and isolation of concerns. Below is an architectural diagram illustrating the interaction between components:

![Architecture Diagram](https://github.com/yourusername/analytics-overview/blob/main/ArchitectureDiagram.PNG)

### Key Features

- **Custom Website Tracking Scripts:** Generate unique tracking scripts to embed in websites for real-time data collection.
- **Real-Time Data Analytics:** Monitor website performance metrics, including total views, unique visitors, and session details.
- **Detailed Visitor Insights:** Analyze metrics such as bounce rates, session durations, and traffic trends.
- **User Authentication:** A secure authentication system ensures personalized and secure access for users.
- **Responsive Dashboard:** A user-friendly dashboard provides a comprehensive overview of website analytics, accessible on all devices.
- **Microservices Architecture:** Each service is isolated, ensuring scalability and maintainability.
- **RabbitMQ Integration:** For seamless message queuing and asynchronous data processing.

## Technologies Used

### Frontend:

- **Next.js (TypeScript):** Delivers a high-performance, scalable, and responsive web application.
- **Tailwind CSS:** Ensures a modern and visually appealing UI with mobile-first responsiveness.
- **Redux:** Manages the global state of the application, ensuring consistency and ease of data flow across components.
- **Apollo Client:** Powers GraphQL API integration for efficient data fetching.
- **Jest:** Used for writing and running unit tests to ensure the reliability and correctness of the application, providing a robust testing framework for the frontend.

### Backend:

- **Node.js (TypeScript):** Provides robust and scalable API endpoints for various services.
- **PostgreSQL:** A relational database for managing users, websites, and analytics data.
- **GraphQL:** Offers a flexible, efficient API design for querying data.
- **RabbitMQ:** Facilitates reliable and efficient message queuing for tracking data.
- **Docker:** Simplifies development and deployment through containerization.

## Analytics Pages

### Dashboard Page:

![Dashboard Page](https://github.com/yourusername/analytics-overview/blob/main/DashboardPage.PNG)

### Visitors Page:

![Visitors Page](https://github.com/yourusername/analytics-overview/blob/main/VisitorsPage.PNG)

### Page Views Page:

![Page Views Page](https://github.com/yourusername/analytics-overview/blob/main/PageViewsPage.PNG)

### Sessions Page:

![Sessions Page](https://github.com/yourusername/analytics-overview/blob/main/SessionsPage.PNG)

## Environment Variables

Here’s a sample `.env` file to configure the services:

```env
# Database
POSTGRES_USER=<postgres_user>
POSTGRES_PASSWORD=<postgres_password>
POSTGRES_DB=<postgres_db>

# Auth Service Secrets
ACCESS_TOKEN_SECRET=<access_token_secret>
REFRESH_TOKEN_SECRET=<refresh_token_secret>
TOKEN_EXPIRATION=<token_expiration>
REFRESH_TOKEN_EXPIRATION=<refresh_token_expiration>

# External URLs
NEXT_PUBLIC_AUTH_SERVICE_URL=<next_public_auth_service_url>
NEXT_PUBLIC_ANALYTICS_SERVICE_URL=<next_public_analytics_service_url>
FRONTEND_SERVICE_URL=<frontend_service_url>
AUTH_SERVICE_URL=<auth_service_url>
ANALYTICS_API_SERVICE_URL=<analytics_api_service_url>

# RabbitMQ and IP API Token
RABBITMQ_URL=<rabbitmq_url>
QUEUE_NAME=<queue_name>
IP_API_TOKEN=<ip_api_token>
```

## Installation

### Prerequisites:

- **Node.js** (v16+)
- **Docker** (for containerized services)
- **RabbitMQ** (message queuing)
- **PostgreSQL** (relational database)

### Steps:

1. Clone the monorepo:

   ```bash
   git clone https://github.com/yourusername/analytics-monorepo.git
   cd analytics-monorepo
   ```

2. Set up the `.env` file:

   - Create a `.env` file in the root directory.
   - Copy the environment variables listed above and update them as necessary.

3. Start the services:

   - With Docker:
     ```bash
     docker-compose up --build
     ```
   - Without Docker:

     - Start each service individually:

       ```bash
       cd services/auth-service
       npm install && npm start

       cd ../analytics-service
       npm install && npm start

       cd ../tracking-service
       npm install && npm start

       cd ../data-processing-service
       npm install && npm start

       cd ../frontend
       npm install && npm run dev
       ```

4. Access the application:
   - Open the frontend in your browser:
     ```
     http://localhost:3000
     ```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the platform.

## License

This project is licensed under the MIT License.
