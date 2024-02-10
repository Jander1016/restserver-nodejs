import { envs } from "./config";
import { MongoDatabase } from "./data/mongodb";
import { Server } from "./presentation/Server";
import { AppRoutes } from "./presentation/routes";

(()=>{
  main();
})()

async function main() {

  await MongoDatabase.connectDb({
      mongoUrl: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
  })

  const server = new Server({
      port: envs.PORT,
      routes: AppRoutes.routes
  });

  server.start()

}