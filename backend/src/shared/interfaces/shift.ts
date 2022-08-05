export interface ICreateShift {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  intervalWeek: string;
}

export interface IUpdateShift {
  name?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  weekId? : string;
  intervalWeek: string;
}