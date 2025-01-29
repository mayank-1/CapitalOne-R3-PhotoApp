# Photo Capture App

## Overview

The **Photo Capture App** is a React application built using **Vite** with TypeScript. It allows users to capture photos from four specific angles (top, bottom, front, and back) using their device's camera and upload them to a backend server. It features:

- Step-by-step photo capture flow.
- Camera permission handling.
- UI feedback for errors and process completion.
- Responsive design for various devices.

---

## Features

1. **Capture Photos**
   - Allows users to capture photos in sequence (top, bottom, front, back).
2. **Error Handling**
   - Displays a message if camera permissions are denied.
3. **Photo Preview**
   - Shows a preview of the captured photos for each step.
4. **Upload Functionality**
   - Uploads all captured photos to a backend API using a `POST` request.
5. **Reset Functionality**
   - Resets the entire process for a fresh start.

---

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v14+ recommended)
- npm or yarn

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/photo-capture-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd photo-capture-app
   ```
3. Install dependencies:

   ```bash
   npm install
   ```

   Or, if using yarn:

   ```bash
   yarn install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Or:
   ```bash
   yarn dev
   ```
5. Open your browser and navigate to the URL provided in the terminal (e.g., `http://localhost:5173`).

---

## Usage

### Step-by-step Guide:

1. Grant camera permissions when prompted.
2. Follow the on-screen instructions to capture photos from the required angles.
3. After capturing all photos, click "Upload Photos" to send them to the backend.
4. Reset the process using the "Reset" button if needed.

---

## API Integration

- API Endpoint: `https://your-api-endpoint.com/upload`
- Method: `POST`
- Body: `FormData` containing the captured photos.
- Example:
  ```javascript
  const response = await fetch("https://your-api-endpoint.com/upload", {
    method: "POST",
    body: formData,
  });
  ```

---

## Dependencies

- **React** (17+)
- **Webcam** (react-webcam)
- **Vite** (for fast development)
- **TypeScript** (for type safety)
- **SCSS** (for styling)
- **classNames** (for conditional class management)

Install all dependencies using:

```bash
npm install
```

## Live Demo

You can view the live demo of the project at [this link](https://wissen-captalone-photoapp.netlify.app/).
