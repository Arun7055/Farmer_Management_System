# 🌾 KisanAI – Farmer Management System

KisanAI is a full-stack web platform designed to help farmers manage lands, crops, equipment, and farmer groups while leveraging AI for insights and natural-language querying of farm data.

The system also supports voice input and multilingual accessibility to improve usability for farmers.

## 🚀 Live Demo
* **KisanAI** [[Click here](https://kisanai-tau.vercel.app/)]

---

## 🚀 Features

### Farm Management
- Manage Farmers : List of farmers and their contact details
  <img width="1416" height="808" alt="image" src="https://github.com/user-attachments/assets/5baccfe7-5f59-4f1e-931a-ef0cfc476869" />

- Manage Lands : Displays different lands owned by different farmers and an AI summary of lands owned by current farmer
 <img width="1416" height="808" alt="image" src="https://github.com/user-attachments/assets/b02daaf5-761f-471e-a666-502d29cfb4af" />
 <img width="1422" height="808" alt="image" src="https://github.com/user-attachments/assets/3f031ad9-7721-4f30-a54a-8aa6a33730b9" />

  
- Manage Crops : Lists all crops grown by different farmers on different lands and AI summary of modern practices for crops grown by current farmer
<img width="1420" height="808" alt="image" src="https://github.com/user-attachments/assets/dc5f983e-7d74-4e10-a870-1412d4a59223" />
<img width="1419" height="795" alt="image" src="https://github.com/user-attachments/assets/d9ebdebb-ad99-4e7f-86ae-3bbcc9c9912b" />

 
- Manage Equipment : Allow farmers to lend and borrow equipments
  <img width="1467" height="834" alt="image" src="https://github.com/user-attachments/assets/be8600f9-09e4-465f-922c-2101e3722907" />

- Farmer Groups and collaboration

### AI Features
- Ask questions in natural language
- AI converts English queries to SQL
- Executes queries and returns results
- Crop insights using AI recommendations

### Accessibility
- Voice-to-text query input in 3 languages : English, Hindi, Kannada
<img width="1419" height="807" alt="image" src="https://github.com/user-attachments/assets/6e8350ff-b34a-4852-aa49-eab2575e9e2e" />
<img width="1411" height="849" alt="image" src="https://github.com/user-attachments/assets/f5dfd934-7294-4bcb-915c-b649738d855a" />

- 
- Multi-language UI support in 3 languages : English, Hindi, Kannada
- Google Translate integration
- <img width="1420" height="794" alt="image" src="https://github.com/user-attachments/assets/2b53a976-b61e-49f4-ba20-fade1e009bf6" />
<img width="1419" height="807" alt="image" src="https://github.com/user-attachments/assets/92241dcf-9b52-466a-9511-4b03481e870d" />


---

## 🛠 Tech Stack

### Authorization
- Clerk : Login using google or email, OTP verification on sign-up/login on new device.
- <img width="538" height="672" alt="image" src="https://github.com/user-attachments/assets/edbc0169-6319-4b37-adf9-fe23039e01ce" />


### Frontend
- React (Vite)
- Material UI
- Web Speech API
- Google Translate Widget

### Backend
- Node.js
- Express.js
- Groq API (LLaMA models)

### Database
- PostgreSQL (NeonDB)

### Deployment
- Frontend: Vercel
- Backend: Render


---

