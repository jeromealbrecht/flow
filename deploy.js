// Script pour déployer sur Firebase
const { execSync } = require("child_process")

console.log("🔨 Building Next.js app...")
execSync("npm run build", { stdio: "inherit" })

console.log("🚀 Deploying to Firebase...")
execSync("firebase deploy", { stdio: "inherit" })

console.log("✅ Deployment complete!")

