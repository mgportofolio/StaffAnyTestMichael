import * as shiftRepository from "../database/default/repository/shiftRepository";
import { Between, FindManyOptions, FindOneOptions } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IUpdateShift } from "../shared/interfaces";
import { ITimeInterval } from "../shared/interfaces/filter";

const formatDateTime = (date: string, time: string) => {
  return Date.parse(date + " " + time);
};


export const find = async (opts: FindManyOptions<Shift>, intervalWeek: string): Promise<Shift[]> => {
  if(intervalWeek !== null || intervalWeek !== undefined || intervalWeek !== ""){ 
    const dateString = intervalWeek.split('|');
    const before = dateString[0];
    const after = dateString[1];
    opts.where = {
            date: Between(before.toString(), after.toString())
        };
    return shiftRepository.find(opts)
  }
  return shiftRepository.find(opts);
};

//true if there is overlap between schedule
//false if there is not overlap between schedule
export const validateOverlap = async (value: ITimeInterval, intervalWeek: string): Promise<Boolean> => {
  let isOverlap = false;
  const opts: FindManyOptions<Shift> = {
    order: {
      date: 'DESC', startTime: 'ASC'
    }
  }
  const data = await find(opts, intervalWeek);

  if(data.length === 1){
    if(data[0].date === value.date){
      isOverlap = formatDateTime(data[0].date, data[0].endTime) >  formatDateTime(value.date, value.start);
    }
  }
  if(data.length > 1){
    let tempData = data.map<ITimeInterval>((value) => {return {start: value.startTime, end: value.endTime, date: value.date}});
    tempData.push({start: value.start, end: value.end, date: value.date});
    tempData.sort((a,b)=>{
      return formatDateTime(a.date, a.start) -  formatDateTime(b.date, b.start);
    });
    console.log(tempData.length);
    console.log("foreach");
    tempData.forEach(element => {
      console.log(element.date, element.start, element.end);
    });
    console.log("validation");
    for(let i = 1; i < tempData.length; i++){
      console.log("Loop " + i.toString());
      console.log(i-1,tempData[i-1].date, tempData[i].date,i)
      console.log(i-1,tempData[i-1].start, tempData[i].start,i)
      console.log(i-1,tempData[i-1].end, tempData[i].end,i)
      console.log(i-1,tempData[i-1].date === tempData[i].date,i);
      if(tempData[i-1].date === tempData[i].date)
      {        
        console.log(tempData[i-1].date, tempData[i-1].end);
        console.log(tempData[i].date, tempData[i-1].start);
        if(formatDateTime(tempData[i-1].date, tempData[i-1].end) > 
            formatDateTime(tempData[i].date, tempData[i].start))
        {
            console.log(formatDateTime(tempData[i-1].date, tempData[i-1].end) + " > " + 
                          formatDateTime(tempData[i].date, tempData[i].start) + " : overlap");
            console.log(tempData[i-1].date, tempData[i-1].end);
            console.log(tempData[i].date, tempData[i].start);
            isOverlap = true;
            break;
        }
      }
    }
  }
  return isOverlap;
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  return shiftRepository.findById(id, opts);
};

export const create = async (payload: ICreateShift): Promise<Shift> => {
  console.log(payload);
  const timeInterval: ITimeInterval = {
    start:payload.startTime, end:payload.endTime, date: payload.date
  };
  const isInvalidToCreate = await validateOverlap(timeInterval, payload.intervalWeek);
  if(isInvalidToCreate) {
    return null;
  }
  const shift = new Shift();
  shift.name = payload.name;
  shift.date = payload.date;
  shift.startTime = payload.startTime;
  shift.endTime = payload.endTime;

  return shiftRepository.create(shift);
};

export const updateById = async (
  id: string,
  payload: IUpdateShift, 
): Promise<Shift> => {
  const timeInterval: ITimeInterval = {
    start:payload.startTime, end:payload.endTime, date: payload.date
  };
  const isInvalidToCreate = await validateOverlap(timeInterval, payload.intervalWeek);
  if(isInvalidToCreate) {
    return null;
  }
  return shiftRepository.updateById(id, {
    ...payload,
  });
};

export const deleteById = async (id: string | string[]) => {
  return shiftRepository.deleteById(id);
};
