

# Student Counseling and Support System
===========================================================================

## Overview

The Student Counseling and Support System (SCSS) enables students to schedule appointments with counselors and allows counselors to address students’ queries effectively. The inclusion of administrative role also ensures effective oversight of the system's operations, counseling slot allocation, and counselor performance.

## Features

* **Counseling Services**: Providing a real-time scheduling system that allows students to book counseling sessions with a counselors.
* **Question & Answer**: Students can post questions to be answered by counselors and initiate a chat for interactive responses.
* **Active Outreach**: Enabling staff to identify and connect to students who may need counseling but are either unaware of or hesitant to use the system.
* **Progess tracking**: Counselors and support staffs can also track student synchronized FPTU academic information, learning process, appointment records and preferences. 
* **Analytics and management**: Offering dashboards for overview of user activities, evaluating counseling effectiveness and managing resources.

## Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Capstone-FA24SE111-GFA24SE27/scss-web.git
2. **Install dependencies**:
    ```sh
   npm install
3. **Start the development server**:
    ```sh
   npm run dev
4. **Access the application**:
    ```sh
   http://localhost:3000
## Run the Application

### Development Environment

1. Build the Docker image:
   ```sh
   docker build -t dotipha/scss-fe .
   ```
2. Run the Docker container:
   ```sh
   docker run -p 3000:80 --name scss-fe dotipha/scss-fe
   ```
3. Access the application at:
   ```sh
   http://localhost:3000
   ```

### Production Environment

1. Pull the Docker image from Docker Hub:
   ```sh
   docker pull dotipha/scss-fe:latest
   ```
2. Run the Docker container:
   ```sh
   docker run -d -p 3000:80 --name scss-fe dotipha/scss-fe:latest
   ```
3. Access the application at:
   ```sh
   http://localhost:3000
   ```

## Accounts for Roles

Here are accounts for each role in the system:

| Role            | Username          | Password    |
|-----------------|-------------------|-------------|
| **Student**     | sm8@gmail.com         | 112233 | 
| **Counselor**   | hanhltna@gmail.com       | 112233 |
| **Support Staff**| ss@gmail.com        | 112233 |
| **Manager**     | manager@gmail.com         | 112233 |
| **Admin**       | admin@gmail.com           | 112233 |
