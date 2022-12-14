import { Server } from "@hapi/hapi";
import createShiftRoutes from "./shifts";
import createWeekRouter from "./weeks";

export default function (server: Server, basePath: string) {
  createShiftRoutes(server, basePath + "/shifts");
  createWeekRouter(server, basePath + "/weeks")
}
