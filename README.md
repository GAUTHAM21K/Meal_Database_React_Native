# 🍽️ Meal Database React Native App

A cross-platform mobile application built with React Native that allows users to browse, search, and save their favorite meals. The app is backed by a Node.js/Express backend and uses REST APIs for data exchange.

## 📁 Project Structure

```bash
Meal_Database_React_Native/
├── backend/        # Node.js + Express backend for meal data
├── mobile/         # React Native frontend application
```

### 🔧 Backend (`backend/`)
- Handles API endpoints for meals and favorites  
- Connects to a database (MongoDB or similar)  
- Provides RESTful services for:
  - Listing meals  
  - Adding/removing favorites  
  - Searching meals by category or name  

### 📱 Mobile (`mobile/`)
- Built with React Native  
- Displays meals in a scrollable list  
- Allows users to mark meals as favorites  
- Fetches data from the backend via REST APIs  
- Uses state management (e.g., Context API or Redux)  

## 🚀 Getting Started

### Prerequisites
- Node.js and npm  
- React Native CLI or Expo  
- MongoDB (or any database used in backend)  

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Mobile Setup
```bash
cd mobile
npm install
npx react-native run-android  # or run-ios
```

## 🌐 API Endpoints

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| GET    | `/api/meals`           | Fetch all meals              |
| GET    | `/api/favorites`       | Fetch user's favorite meals  |
| POST   | `/api/favorites/:id`   | Add meal to favorites        |
| DELETE | `/api/favorites/:id`   | Remove meal from favorites   |

## 📦 Technologies Used

- **Frontend:** React Native, JavaScript  
- **Backend:** Node.js, Express  
- **Database:** MongoDB (assumed)  
- **API Testing:** Postman  

## 📌 Features

- Browse meals with images and descriptions  
- Mark/unmark meals as favorites  
- Responsive UI for Android and iOS  
- Modular code structure for scalability  

## 🛠️ Future Improvements

- Add user authentication  
- Implement search and filter options  
- Improve UI/UX with animations  
- Deploy backend to cloud (e.g., Render, Heroku)  


