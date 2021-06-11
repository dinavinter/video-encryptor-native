const dbName = "app_db_1";
const dbPath = `db/${dbName}`;
const dbPort = 10102;
const dbUrl = `http://localhost:${dbPort}/${dbPath}`;
export const dbConsts = {
  name: dbName,
  path: dbPath,
  port: dbPort,
  url: dbUrl
};
export const useDbConsts = () => dbConsts;
