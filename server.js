import 'dotenv/config';
import express, { urlencoded } from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import patientRoutes from './src/routes/patientRoutes.js';
// import chatbotRoutes from "./src/routes/chatbot.js";
// import recordRoutes from "./src/routes/recordRoutes.js";
// import accessRoutes from "./src/routes/accessRoutes.js";
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(urlencoded({extended:true}))
// Routes
app.get('/', (req, res) => {
  res.send('Medichain API is running...');
});
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
// app.use("/api", chatbotRoutes);
// app.use("/api/records", recordRoutes);
// app.use("/api/access", accessRoutes);
// Start server after DB connection
const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
