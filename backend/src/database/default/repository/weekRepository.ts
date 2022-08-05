import {
  getRepository,
  FindManyOptions,
} from "typeorm";
import moduleLogger from "../../../shared/functions/logger";
import Week from "../entity/week";

const logger = moduleLogger("weekRepository");

export const find = async (
  opts: FindManyOptions<Week>
): Promise<Week[]> => {
  logger.info("Find one");
  const repository = getRepository(Week);
  const data = await repository.find(opts);
  return data;
};

export const create = async (payload: Week): Promise<Week> => {
  logger.info("Create");
  const repository = getRepository(Week);
  const newdata = await repository.save(payload);
  return newdata;
};
