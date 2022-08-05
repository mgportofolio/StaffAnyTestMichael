import { Request, ResponseToolkit } from "@hapi/hapi";
import * as weekUsecase from "../../../usecases/weekUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
  ICreateWeek, ISuccessResponse
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";

const logger = moduleLogger("weekController");

export const find = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find shift by id");
  try {
    const filter = req.query;
    console.log(filter);
    const data = await weekUsecase.find(filter);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get week successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};

export const create = async (req: Request, h: ResponseToolkit) => {
  logger.info("Publish Week");
  try {
    const body = req.payload as ICreateWeek;
    const data = await weekUsecase.create(body);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Publish Week successfully",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};