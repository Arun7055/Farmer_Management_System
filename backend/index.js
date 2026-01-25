import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import farmerRoutes from "./routes/farmerRoutes.js";
import landRoutes from "./routes/landRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import groupMemberRoutes from "./routes/grupMemberRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";

import { runMigrations } from "./db/migrations.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/farmers", farmerRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/groups", groupMemberRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/execute-sql", executeRoutes); 

// Start server
runMigrations().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err)=>{
    console.log(err);
})


// user logins in
// user gets his data
// user gets his transactions

// login(name,pass).then((user)=>{
    //     getUserData(user.id).then((data)=>{
        //         getUserTransactions(user.id).then((transactions)=>{})
//

//try {
    // const user = await login(name,pass);
// const data = await getUserData(user.id);
// const transactions = await getUserTransactions(user.id);

//}
// catch(err){

// }