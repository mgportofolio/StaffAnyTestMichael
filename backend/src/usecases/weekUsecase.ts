import * as weekRepository from "../database/default/repository/weekRepository";
import { FindManyOptions } from "typeorm";
import Week from "../database/default/entity/week";
import { ICreateWeek } from "../shared/interfaces";

export const find = async (opts: FindManyOptions<Week>): Promise<Week[]> => {
  return weekRepository.find(opts);
};

export const create = async (payload: ICreateWeek): Promise<Week> => {
  const week = new Week();
  week.WeekRange = payload.weekRange;
  week.WeekInterval = payload.weekInterval;
  week.PublishedAt = payload.publishedAt;

  return weekRepository.create(week);
};