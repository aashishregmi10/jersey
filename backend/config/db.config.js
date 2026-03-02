import mongoose from "mongoose";
import dns from "dns";

// Use Google public DNS so mongodb+srv:// SRV lookups don't fail
// behind VPN / corporate / proxy DNS servers.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async (retries = 5) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(
        `❌ MongoDB connection attempt ${i}/${retries} failed: ${error.message}`,
      );
      if (i === retries) {
        console.error("All connection attempts exhausted. Exiting.");
        process.exit(1);
      }
      // wait 3 seconds before retrying
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
};
